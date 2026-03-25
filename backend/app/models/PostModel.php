<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;

final class PostModel
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::pdo();
    }

    public function create(int $userId, string $content, ?string $imagePath): int
    {
        $stmt = $this->pdo->prepare('INSERT INTO posts (user_id, content, image, created_at) VALUES (?, ?, ?, NOW())');
        $stmt->execute([$userId, $content, $imagePath]);
        return (int)$this->pdo->lastInsertId();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT id, user_id, content, image, created_at FROM posts WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function update(int $postId, int $userId, string $content, ?string $imagePath): bool
    {
        if ($imagePath !== null) {
            $stmt = $this->pdo->prepare('UPDATE posts SET content = ?, image = ? WHERE id = ? AND user_id = ?');
            $stmt->execute([$content, $imagePath, $postId, $userId]);
            return $stmt->rowCount() > 0;
        }

        $stmt = $this->pdo->prepare('UPDATE posts SET content = ? WHERE id = ? AND user_id = ?');
        $stmt->execute([$content, $postId, $userId]);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $postId, int $userId): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM posts WHERE id = ? AND user_id = ?');
        $stmt->execute([$postId, $userId]);
        return $stmt->rowCount() > 0;
    }

    public function feed(int $viewerUserId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT p.id, p.user_id, p.content, p.image, p.created_at,
                    u.username, u.full_name, u.profile_image,
                    (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count,
                    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
                    EXISTS(SELECT 1 FROM likes l2 WHERE l2.post_id = p.id AND l2.user_id = ?) AS liked_by_me
             FROM posts p
             JOIN users u ON u.id = p.user_id
             ORDER BY p.created_at DESC'
        );
        $stmt->execute([$viewerUserId]);
        return $stmt->fetchAll();
    }

    public function findByUserId(int $userId, int $viewerUserId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT p.id, p.user_id, p.content, p.image, p.created_at,
                    u.username, u.full_name, u.profile_image,
                    (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count,
                    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
                    EXISTS(SELECT 1 FROM likes l2 WHERE l2.post_id = p.id AND l2.user_id = ?) AS liked_by_me
             FROM posts p
             JOIN users u ON u.id = p.user_id
             WHERE p.user_id = ?
             ORDER BY p.created_at DESC'
        );
        $stmt->execute([$viewerUserId, $userId]);
        return $stmt->fetchAll();
    }

    public function search(string $q, int $viewerUserId, int $limit = 20): array
    {
        $like = '%' . $q . '%';
        $stmt = $this->pdo->prepare(
            'SELECT p.id, p.user_id, p.content, p.image, p.created_at,
                    u.username, u.full_name, u.profile_image,
                    (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count,
                    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
                    EXISTS(SELECT 1 FROM likes l2 WHERE l2.post_id = p.id AND l2.user_id = ?) AS liked_by_me
             FROM posts p
             JOIN users u ON u.id = p.user_id
             WHERE p.content LIKE ?
             ORDER BY p.created_at DESC
             LIMIT ?'
        );
        $stmt->bindValue(1, $viewerUserId, PDO::PARAM_INT);
        $stmt->bindValue(2, $like);
        $stmt->bindValue(3, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
