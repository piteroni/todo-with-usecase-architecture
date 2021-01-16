<?php

namespace Tests;

use Tests\CreatesApplication;
use Illuminate\Foundation\Testing\Concerns;
use Illuminate\Foundation\Testing\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class Application extends TestCase
{
    use CreatesApplication, DatabaseTransactions;

    use Concerns\InteractsWithContainer,
        Concerns\MakesHttpRequests,
        Concerns\InteractsWithAuthentication,
        Concerns\InteractsWithConsole,
        Concerns\InteractsWithDatabase,
        Concerns\InteractsWithExceptionHandling,
        Concerns\InteractsWithSession,
        Concerns\MocksApplicationServices;

    protected function setUp(): void
    {
        $this->setUpEnvironments();

        parent::setUp();
    }

    /**
     * 環境変数を初期化する.
     */
    public function setUpEnvironments(): void
    {
        putenv('APP_URL=' . $this->baseUrl());
        putenv('APP_ENV=testing');
    }

    /**
     * アプリケーションのテスト中に使用するベース URL.
     */
    public function baseUrl(): string
    {
        return 'http://proxy:9000/api/v0';
    }

    /**
     * メソッドを外部から呼び出し可能にする.
     */
    public function __call($method, $params)
    {
        return method_exists($this, $method)
                ? call_user_func_array([$this, $method], $params)
                : call_user_func_array([$this->app, $method], $params);
    }

    /**
     * プロパティを外部から更新可能にする.
     */
    public function __set($property, $value)
    {
        $this->{$property} = $value;
    }

    /**
     * プロパティを外部から参照可能にする.
     */
    public function __get($property)
    {
        return property_exists($this, $property) ? $this->{$property} : null;
    }
}