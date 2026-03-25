<?php

declare(strict_types=1);

require_once __DIR__ . '/../app/bootstrap.php';

use App\Core\Router;
use App\Controllers\AuthController;
use App\Controllers\ProfileController;
use App\Controllers\PostController;
use App\Controllers\CommentController;
use App\Controllers\LikeController;
use App\Controllers\SearchController;

$router = new Router();

$router->get('/api/health', function () {
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(['ok' => true]);
});

$authController = new AuthController();
$profileController = new ProfileController();
$postController = new PostController();
$commentController = new CommentController();
$likeController = new LikeController();
$searchController = new SearchController();

$router->post('/api/auth/register', [$authController, 'register']);
$router->post('/api/auth/login', [$authController, 'login']);
$router->post('/api/auth/logout', [$authController, 'logout']);
$router->get('/api/auth/me', [$authController, 'me']);

$router->get('/api/profile/:username', [$profileController, 'show']);
$router->post('/api/profile/update', [$profileController, 'update']);

$router->get('/api/feed', [$postController, 'feed']);
$router->post('/api/posts', [$postController, 'create']);
$router->put('/api/posts/:id', [$postController, 'update']);
$router->delete('/api/posts/:id', [$postController, 'delete']);

$router->post('/api/posts/:id/comments', [$commentController, 'create']);
$router->put('/api/comments/:id', [$commentController, 'update']);
$router->delete('/api/comments/:id', [$commentController, 'delete']);

$router->post('/api/posts/:id/like', [$likeController, 'toggle']);

$router->get('/api/search', [$searchController, 'search']);

$router->dispatch();
