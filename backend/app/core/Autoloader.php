<?php

declare(strict_types=1);

namespace App\Core;

final class Autoloader
{
    public static function register(): void
    {
        spl_autoload_register(function (string $class): void {
            $prefix = 'App\\';
            if (strpos($class, $prefix) !== 0) {
                return;
            }

            $relative = substr($class, strlen($prefix));
            $relativePath = str_replace('\\', DIRECTORY_SEPARATOR, $relative) . '.php';

            $baseDir = __DIR__ . '/../';
            $file = $baseDir . $relativePath;

            if (is_file($file)) {
                require_once $file;
            }
        });
    }
}
