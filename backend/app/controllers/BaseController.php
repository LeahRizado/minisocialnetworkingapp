<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Session;
use function App\Core\json_response;

abstract class BaseController
{
    protected function requireAuth(): int
    {
        $userId = Session::userId();
        if ($userId === null) {
            json_response(['error' => 'Unauthorized'], 401);
        }
        return $userId;
    }
}
