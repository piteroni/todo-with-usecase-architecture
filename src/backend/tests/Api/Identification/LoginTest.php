<?php

use App\Enums\HttpStatusCode;
use App\Models\User;

describe('/identification/login', function () {
    $path = '/identification/login';

    beforeEach(function () {
        $this->user = User::factory()->create();
    });

    describe('200', function() use ($path) {
        it('登録済みのユーザーとメールアドレスを送信すると、ユーザのAPI Tokenが返ってくる', function () use ($path) {
            $statusCode = HttpStatusCode::OK;
            $method = 'POST';
            $requestBody = [
                'email' => $this->user->email(),
                'password' => 'password',
            ];

            $response = $this->application->json($method, $path, $requestBody);

            expect($response->getStatusCode())->toBe($statusCode);
        });
    });
});
