<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\PostModel;
use App\Models\UserModel;
use function App\Core\json_response;
use function App\Core\sanitize_text;

final class SearchController extends BaseController
{
    private UserModel $users;
    private PostModel $posts;

    public function __construct()
    {
        $this->users = new UserModel();
        $this->posts = new PostModel();
    }

    public function search(): void
    {
        $viewerId = $this->requireAuth();
        $q = sanitize_text($_GET['q'] ?? '', 80);
        $type = sanitize_text($_GET['type'] ?? 'users', 10);

        if ($q === '') {
            json_response(['results' => []]);
        }

        if ($type === 'posts') {
            $results = $this->posts->search($q, $viewerId);
            json_response(['results' => $results]);
        }

        $results = $this->users->search($q);
        json_response(['results' => $results]);
    }
}
