<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Session;
use App\Models\UserModel;
use function App\Core\get_json_input;
use function App\Core\json_response;
use function App\Core\require_fields;
use function App\Core\sanitize_text;

final class AuthController extends BaseController
{
    private UserModel $users;

    public function __construct()
    {
        $this->users = new UserModel();
    }

    public function register(): void
    {
        $input = get_json_input();
        $missing = require_fields($input, ['username', 'password', 'full_name']);
        if (count($missing) > 0) {
            json_response(['error' => 'Missing fields', 'missing' => $missing], 422);
        }

        $username = strtolower(sanitize_text((string)$input['username'], 30));
        $password = (string)$input['password'];
        $fullName = sanitize_text((string)$input['full_name'], 80);

        if (!preg_match('/^[a-z0-9_]{3,30}$/', $username)) {
            json_response(['error' => 'Invalid username'], 422);
        }
        if (strlen($password) < 6) {
            json_response(['error' => 'Password must be at least 6 characters'], 422);
        }
        if ($this->users->existsUsername($username)) {
            json_response(['error' => 'Username already taken'], 409);
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $userId = $this->users->create($username, $hash, $fullName);

        Session::login($userId);
        $me = $this->users->findById($userId);
        json_response(['user' => $me], 201);
    }

    public function login(): void
    {
        $input = get_json_input();
        $missing = require_fields($input, ['username', 'password']);
        if (count($missing) > 0) {
            json_response(['error' => 'Missing fields', 'missing' => $missing], 422);
        }

        $username = strtolower(sanitize_text((string)$input['username'], 30));
        $password = (string)$input['password'];

        $row = $this->users->findAuthByUsername($username);
        if (!$row || !password_verify($password, (string)$row['password'])) {
            json_response(['error' => 'Invalid credentials'], 401);
        }

        Session::login((int)$row['id']);
        $me = $this->users->findById((int)$row['id']);
        json_response(['user' => $me]);
    }

    public function logout(): void
    {
        $this->requireAuth();
        Session::logout();
        json_response(['ok' => true]);
    }

    public function me(): void
    {
        $userId = Session::userId();
        if ($userId === null) {
            json_response(['user' => null]);
        }
        $me = $this->users->findById($userId);
        json_response(['user' => $me]);
    }
}
