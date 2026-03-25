<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\LikeModel;
use App\Models\PostModel;
use function App\Core\json_response;

final class LikeController extends BaseController
{
    private LikeModel $likes;
    private PostModel $posts;

    public function __construct()
    {
        $this->likes = new LikeModel();
        $this->posts = new PostModel();
    }

    public function toggle(array $params): void
    {
        $userId = $this->requireAuth();
        $postId = (int)($params['id'] ?? 0);
        if ($postId <= 0 || $this->posts->findById($postId) === null) {
            json_response(['error' => 'Post not found'], 404);
        }

        $liked = $this->likes->hasLiked($postId, $userId);
        if ($liked) {
            $this->likes->unlike($postId, $userId);
        } else {
            $this->likes->like($postId, $userId);
        }

        $count = $this->likes->countByPostId($postId);
        json_response(['liked' => !$liked, 'like_count' => $count]);
    }
}
