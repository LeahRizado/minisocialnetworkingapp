<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;

final class LikeModel
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::pdo();
    }

    public function hasLiked(int $postId, int $userId): bool
    {
        $stmt = $this->pdo->prepare('SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?');
        $stmt->execute([$postId, $userId]);
        return (bool)$stmt->fetchColumn();
    }

    public function like(int $postId, int $userId): void
    {
        $stmt = $this->pdo->prepare('INSERT IGNORE INTO likes (post_id, user_id) VALUES (?, ?)');
        $stmt->execute([$postId, $userId]);
    }

    public function unlike(int $postId, int $userId): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM likes WHERE post_id = ? AND user_id = ?');
        $stmt->execute([$postId, $userId]);
    }

    public function countByPostId(int $postId): int
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM likes WHERE post_id = ?');
        $stmt->execute([$postId]);
        return (int)$stmt->fetchColumn();
    }
}
