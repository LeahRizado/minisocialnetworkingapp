<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\CommentModel;
use App\Models\PostModel;
use function App\Core\get_json_input;
use function App\Core\json_response;
use function App\Core\sanitize_text;

final class PostController extends BaseController
{
    private PostModel $posts;
    private CommentModel $comments;

    public function __construct()
    {
        $this->posts = new PostModel();
        $this->comments = new CommentModel();
    }

    public function feed(): void
    {
        $viewerId = $this->requireAuth();
        $items = $this->posts->feed($viewerId);
        $postIds = array_map(fn ($p) => (int)$p['id'], $items);
        $commentMap = $this->comments->getByPostIds($postIds);
        json_response(['posts' => $items, 'comments' => $commentMap]);
    }

    public function create(): void
    {
        $userId = $this->requireAuth();

        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        $content = '';
        $imagePath = null;

        if (stripos($contentType, 'multipart/form-data') !== false) {
            $content = sanitize_text($_POST['content'] ?? '', 2000);
            if (isset($_FILES['image']) && is_array($_FILES['image']) && ($_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK) {
                $imagePath = $this->saveUpload($_FILES['image'], 'posts');
            }
        } else {
            $input = get_json_input();
            $content = sanitize_text($input['content'] ?? '', 2000);
        }

        if ($content === '') {
            json_response(['error' => 'Content is required'], 422);
        }

        $postId = $this->posts->create($userId, $content, $imagePath);
        $created = $this->posts->findById($postId);
        json_response(['post' => $created], 201);
    }

    public function update(array $params): void
    {
        $userId = $this->requireAuth();
        $postId = (int)($params['id'] ?? 0);
        if ($postId <= 0) {
            json_response(['error' => 'Invalid post id'], 422);
        }

        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        $content = '';
        $imagePath = null;

        if (stripos($contentType, 'multipart/form-data') !== false) {
            $content = sanitize_text($_POST['content'] ?? '', 2000);
            if (isset($_FILES['image']) && is_array($_FILES['image']) && ($_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK) {
                $imagePath = $this->saveUpload($_FILES['image'], 'posts');
            }
        } else {
            $input = get_json_input();
            $content = sanitize_text($input['content'] ?? '', 2000);
        }

        if ($content === '') {
            json_response(['error' => 'Content is required'], 422);
        }

        $ok = $this->posts->update($postId, $userId, $content, $imagePath);
        if (!$ok) {
            json_response(['error' => 'Not found or not allowed'], 404);
        }

        $updated = $this->posts->findById($postId);
        json_response(['post' => $updated]);
    }

    public function delete(array $params): void
    {
        $userId = $this->requireAuth();
        $postId = (int)($params['id'] ?? 0);
        if ($postId <= 0) {
            json_response(['error' => 'Invalid post id'], 422);
        }

        $ok = $this->posts->delete($postId, $userId);
        if (!$ok) {
            json_response(['error' => 'Not found or not allowed'], 404);
        }

        json_response(['ok' => true]);
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
