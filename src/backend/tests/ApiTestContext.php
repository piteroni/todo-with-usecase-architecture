<?php

namespace Tests;

class ApiTestContext
{
    /**
     * APIテスト情報が格納された配列.
     */
    private array $contexts = [];
    
    /**
     * APIテスト情報をスタックに保存する.
     * 
     * @param string $path
     *   APIのテスト対象パス.
     * @param string $method
     *   APIのテスト対象メソッド.
     * @param int $statusCode
     *   APIのテスト対象HTTPステータスコード.
     * @param mixed $requestBody
     *   APIの送信したリクエストボディ.
     * @param mixed $responseBody
     *   APIの送信されたレスポンスボディ.
     */
    public function add(string $path, string $method, int $statusCode, $requestBody, $responseBody): void
    {
        $this->contexts[] = [
            'path' => $path,
            'method' => $method,
            'statusCode' => $statusCode,
            'requestBody' => $requestBody,
            'responseBody' => $responseBody
        ];
    }

    /**
     * APIテスト情報をJSONに書き込む.
     */
    public function dump(): void
    {
        $f = fopen('apitest-contexts.json', 'w+b');
        fwrite($f, json_encode($this->contexts, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        fclose($f);
    }

    /**
     * APIテスト情報が格納された配列を取得する.
     * 
     * @return array
     *   APIテスト情報が格納された配列.
     */
    public function contexts(): array
    {
        return $this->contexts;
    }
}
