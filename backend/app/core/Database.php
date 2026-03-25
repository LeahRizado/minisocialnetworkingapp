<?php

declare(strict_types=1);

namespace App\Core;

use PDO;
use PDOException;
use function App\Core\json_response;

final class Database
{
    private static ?PDO $pdo = null;

    public static function pdo(): PDO
    {
        if (self::$pdo instanceof PDO) {
            return self::$pdo;
        }

        $config = require __DIR__ . '/../config/database.php';
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $config['host'], $config['port'], $config['dbname']);

        try {
            $pdo = new PDO($dsn, $config['user'], $config['pass'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (PDOException $e) {
            json_response(['error' => 'Database connection failed'], 500);
        }

        self::$pdo = $pdo;
        return self::$pdo;
    }
}
