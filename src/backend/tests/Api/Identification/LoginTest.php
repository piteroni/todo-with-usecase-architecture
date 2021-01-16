<?php

use App\Enums\HttpStatusCode;
use App\Models\User;

describe('/identification/login', function () {
    $path = '/identification/login';

    beforeEach(function () {
        $this->user = User::factory()->create();
    });

    it('登録済みのユーザーとメールアドレスを送信すると、ユーザのAPI Tokenが返ってくる', function () use ($path) {
        $statusCode = HttpStatusCode::OK;
        $method = 'POST';
        $requestBody = [
            'email' => $this->user->email(),
            'password' => 'password',
        ];
        
        $response = $this->application->json($method, $path, $requestBody);
        $responseBody = $response->json();

        $this->apiTestContext->add($path, $method, $statusCode, $requestBody, $responseBody);

        expect($response->getStatusCode())->toBe($statusCode);
    });
});
