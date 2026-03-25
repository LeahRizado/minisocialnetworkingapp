<?php

declare(strict_types=1);

namespace App\Core;

use function App\Core\json_response;

final class Router
{
    /** @var array<string, array<int, array{pattern:string, handler:callable}>> */
    private array $routes = [
        'GET' => [],
        'POST' => [],
        'PUT' => [],
        'DELETE' => [],
        'OPTIONS' => [],
    ];

    public function get(string $path, callable $handler): void { $this->add('GET', $path, $handler); }
    public function post(string $path, callable $handler): void { $this->add('POST', $path, $handler); }
    public function put(string $path, callable $handler): void { $this->add('PUT', $path, $handler); }
    public function delete(string $path, callable $handler): void { $this->add('DELETE', $path, $handler); }

    private function add(string $method, string $path, callable $handler): void
    {
        $pattern = preg_replace('#:([A-Za-z_][A-Za-z0-9_]*)#', '(?P<$1>[^/]+)', $path);
        $pattern = '#^' . $pattern . '$#';
        $this->routes[$method][] = ['pattern' => $pattern, 'handler' => $handler];
    }

    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';

        $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
        $basePath = rtrim(str_replace('\\', '/', dirname($scriptName)), '/');
        if ($basePath !== '' && $basePath !== '.' && strpos($path, $basePath) === 0) {
            $path = substr($path, strlen($basePath));
            if ($path === '') {
                $path = '/';
            }
        }

        if ($method === 'OPTIONS') {
            http_response_code(204);
            exit;
        }

        foreach ($this->routes[$method] ?? [] as $route) {
            if (preg_match($route['pattern'], $path, $matches)) {
                $params = [];
                foreach ($matches as $k => $v) {
                    if (!is_int($k)) {
                        $params[$k] = $v;
                    }
                }
                call_user_func($route['handler'], $params);
                return;
            }
        }

        json_response(['error' => 'Not found'], 404);
    }
}
