<?php

namespace Tests;

use Codeception\Specify;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, Specify;

    /**
     * APIの基底URLを取得する.
     *
     * @return string
     *   APIの基底URL.
     */
    protected function apiBaseUrl(): string
    {
        return 'http://proxy:9000/api/v0';
    }
}
