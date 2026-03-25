<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;

final class CommentModel
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::pdo();
    }

    public function create(int $postId, int $userId, string $content): int
    {
        $stmt = $this->pdo->prepare('INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())');
        $stmt->execute([$postId, $userId, $content]);
        return (int)$this->pdo->lastInsertId();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT id, post_id, user_id, content, created_at FROM comments WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function update(int $commentId, int $userId, string $content): bool
    {
        $stmt = $this->pdo->prepare('UPDATE comments SET content = ? WHERE id = ? AND user_id = ?');
        $stmt->execute([$content, $commentId, $userId]);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $commentId, int $userId): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM comments WHERE id = ? AND user_id = ?');
        $stmt->execute([$commentId, $userId]);
        return $stmt->rowCount() > 0;
    }

    public function getByPostIds(array $postIds): array
    {
        $postIds = array_values(array_filter(array_map('intval', $postIds), fn ($v) => $v > 0));
        if (count($postIds) === 0) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($postIds), '?'));
        $sql = 'SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, u.username, u.full_name, u.profile_image
                FROM comments c
                JOIN users u ON u.id = c.user_id
                WHERE c.post_id IN (' . $placeholders . ')
                ORDER BY c.created_at ASC';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($postIds);
        $rows = $stmt->fetchAll();

        $grouped = [];
        foreach ($rows as $r) {
            $pid = (int)$r['post_id'];
            if (!isset($grouped[$pid])) {
                $grouped[$pid] = [];
            }
            $grouped[$pid][] = $r;
        }

        return $grouped;
    }
}
