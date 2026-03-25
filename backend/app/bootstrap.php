<?php

declare(strict_types=1);

require_once __DIR__ . '/core/Autoloader.php';

App\Core\Autoloader::register();

require_once __DIR__ . '/core/helpers.php';

App\Core\Session::start();
App\Core\Cors::handle();
