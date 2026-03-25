<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\PostModel;
use App\Models\UserModel;
use function App\Core\json_response;
use function App\Core\sanitize_text;

final class ProfileController extends BaseController
{
    private UserModel $users;
    private PostModel $posts;

    public function __construct()
    {
        $this->users = new UserModel();
        $this->posts = new PostModel();
    }

    public function show(array $params): void
    {
        $viewerId = $this->requireAuth();
        $username = sanitize_text($params['username'] ?? '', 30);

        $user = $this->users->findByUsername($username);
        if (!$user) {
            json_response(['error' => 'User not found'], 404);
        }

        $userPosts = $this->posts->findByUserId((int)$user['id'], $viewerId);
        json_response(['user' => $user, 'posts' => $userPosts]);
    }

    public function update(): void
    {
        $userId = $this->requireAuth();

        $fullName = sanitize_text($_POST['full_name'] ?? '', 80);
        $bio = sanitize_text($_POST['bio'] ?? '', 160);

        if ($fullName === '') {
            json_response(['error' => 'Full name is required'], 422);
        }

        $profileImagePath = null;
        if (isset($_FILES['profile_image']) && is_array($_FILES['profile_image']) && ($_FILES['profile_image']['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK) {
            $profileImagePath = $this->saveUpload($_FILES['profile_image'], 'avatars');
        }

        $this->users->updateProfile($userId, $fullName, $bio, $profileImagePath);
        $me = $this->users->findById($userId);
        json_response(['user' => $me]);
    }

    private function saveUpload(array $file, string $folder): string
    {
        $tmp = (string)($file['tmp_name'] ?? '');
        $name = (string)($file['name'] ?? '');

        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array($ext, $allowed, true)) {
            json_response(['error' => 'Invalid file type'], 422);
        }

        $base = bin2hex(random_bytes(16)) . '.' . $ext;
        $rel = '/uploads/' . $folder . '/' . $base;
        $destDir = __DIR__ . '/../../public/uploads/' . $folder;
        if (!is_dir($destDir)) {
            mkdir($destDir, 0777, true);
        }
        $dest = $destDir . '/' . $base;

        if (!is_uploaded_file($tmp) || !move_uploaded_file($tmp, $dest)) {
            json_response(['error' => 'Upload failed'], 500);
        }

        return $rel;
    }
}
