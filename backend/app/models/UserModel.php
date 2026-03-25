<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;

final class UserModel
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::pdo();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT id, username, full_name, bio, profile_image, created_at FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findByUsername(string $username): ?array
    {
        $stmt = $this->pdo->prepare('SELECT id, username, full_name, bio, profile_image, created_at FROM users WHERE username = ?');
        $stmt->execute([$username]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findAuthByUsername(string $username): ?array
    {
        $stmt = $this->pdo->prepare('SELECT id, username, password, full_name, bio, profile_image, created_at FROM users WHERE username = ?');
        $stmt->execute([$username]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function existsUsername(string $username): bool
    {
        $stmt = $this->pdo->prepare('SELECT 1 FROM users WHERE username = ?');
        $stmt->execute([$username]);
        return (bool)$stmt->fetchColumn();
    }

    public function create(string $username, string $passwordHash, string $fullName): int
    {
        $stmt = $this->pdo->prepare('INSERT INTO users (username, password, full_name, bio, profile_image, created_at) VALUES (?, ?, ?, \'\', NULL, NOW())');
        $stmt->execute([$username, $passwordHash, $fullName]);
        return (int)$this->pdo->lastInsertId();
    }

    public function updateProfile(int $userId, string $fullName, string $bio, ?string $profileImage): void
    {
        if ($profileImage !== null) {
            $stmt = $this->pdo->prepare('UPDATE users SET full_name = ?, bio = ?, profile_image = ? WHERE id = ?');
            $stmt->execute([$fullName, $bio, $profileImage, $userId]);
            return;
        }

        $stmt = $this->pdo->prepare('UPDATE users SET full_name = ?, bio = ? WHERE id = ?');
        $stmt->execute([$fullName, $bio, $userId]);
    }

    public function search(string $q, int $limit = 20): array
    {
        $like = '%' . $q . '%';
        $stmt = $this->pdo->prepare('SELECT id, username, full_name, bio, profile_image, created_at FROM users WHERE username LIKE ? OR full_name LIKE ? ORDER BY username ASC LIMIT ?');
        $stmt->bindValue(1, $like);
        $stmt->bindValue(2, $like);
        $stmt->bindValue(3, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
