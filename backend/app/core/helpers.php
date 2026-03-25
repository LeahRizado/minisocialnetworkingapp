<?php

declare(strict_types=1);

namespace App\Core;

function json_response(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function get_json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function sanitize_text(?string $value, int $maxLen = 5000): string
{
    $value = $value ?? '';
    $value = trim($value);
    if (mb_strlen($value) > $maxLen) {
        $value = mb_substr($value, 0, $maxLen);
    }
    return $value;
}

function require_fields(array $input, array $fields): array
{
    $missing = [];
    foreach ($fields as $f) {
        if (!array_key_exists($f, $input) || $input[$f] === null || $input[$f] === '') {
            $missing[] = $f;
        }
    }
    return $missing;
}
