<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\CommentModel;
use App\Models\PostModel;
use function App\Core\get_json_input;
use function App\Core\json_response;
use function App\Core\sanitize_text;

final class CommentController extends BaseController
{
    private CommentModel $comments;
    private PostModel $posts;

    public function __construct()
    {
        $this->comments = new CommentModel();
        $this->posts = new PostModel();
    }

    public function create(array $params): void
    {
        $userId = $this->requireAuth();
        $postId = (int)($params['id'] ?? 0);
        if ($postId <= 0 || $this->posts->findById($postId) === null) {
            json_response(['error' => 'Post not found'], 404);
        }

        $input = get_json_input();
        $content = sanitize_text($input['content'] ?? '', 800);
        if ($content === '') {
            json_response(['error' => 'Content is required'], 422);
        }

        $commentId = $this->comments->create($postId, $userId, $content);
        $created = $this->comments->findById($commentId);
        json_response(['comment' => $created], 201);
    }

    public function update(array $params): void
    {
        $userId = $this->requireAuth();
        $commentId = (int)($params['id'] ?? 0);
        if ($commentId <= 0) {
            json_response(['error' => 'Invalid comment id'], 422);
        }

        $input = get_json_input();
        $content = sanitize_text($input['content'] ?? '', 800);
        if ($content === '') {
            json_response(['error' => 'Content is required'], 422);
        }

        $ok = $this->comments->update($commentId, $userId, $content);
        if (!$ok) {
            json_response(['error' => 'Not found or not allowed'], 404);
        }

        $updated = $this->comments->findById($commentId);
        json_response(['comment' => $updated]);
    }

    public function delete(array $params): void
    {
        $userId = $this->requireAuth();
        $commentId = (int)($params['id'] ?? 0);
        if ($commentId <= 0) {
            json_response(['error' => 'Invalid comment id'], 422);
        }

        $ok = $this->comments->delete($commentId, $userId);
        if (!$ok) {
            json_response(['error' => 'Not found or not allowed'], 404);
        }

        json_response(['ok' => true]);
    }
}
