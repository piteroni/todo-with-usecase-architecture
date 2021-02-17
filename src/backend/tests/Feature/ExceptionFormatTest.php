<?php

use App\Exceptions\Api\ApiException;
use App\Exceptions\ExceptionFormattable;
use Tests\TestCase;

class ExceptionFormatTest extends TestCase
{
    /**
     * 例外オブジェクトを渡すと、例外クラス名、例外送出元ファイル情報、派生元例外情報、スタックトレースなどを含んだ文字列を取得出来る.
     */
    public function testFormatException(): void
    {
        $formetter = new ExceptionFormatter();

        $apiException = new ApiException('api-exception', 'api-exception-message');
        $previous = new PreviousException('previous-exception');

        $actual = $formetter->formatApiException($apiException, $previous, ['context' => 'mock']);

        $expected = <<<EOS
        PreviousException at .*\/ExceptionFormatTest.php\(\d*\)
        {
            "context": "mock",
            "operationId": "api-exception",
            "message": "previous-exception"
        }
        \[stacktrace\]
        #0 .*TestCase\.php\(\d*\): ExceptionFormatTest->testFormatException\(\)
        EOS;

        $this->assertMatchesRegularExpression("/^$expected/", $actual);
    }
}

class PreviousException extends Exception {}

class ExceptionFormatter
{
    use ExceptionFormattable;

    public function __call($method, $params)
    {
        return method_exists($this, $method) ? call_user_func_array([$this, $method], $params) : call_user_func_array([$this->app, $method], $params);
    }
}
