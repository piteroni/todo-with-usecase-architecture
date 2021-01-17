<?php

use App\Models\User;
use App\Models\Task;
use App\Enums\HttpStatusCode;

describe('/users/current/tasks', function () {
    $path = '/users/current/tasks';

    beforeEach(function () {
        $user = User::factory()->create();

        $this->credential = [
            'Authorization' => 'Bearer ' . $user->createToken('apiToken')->plainTextToken
        ];
    });

    describe('201', function () use ($path) {
        it('タスクを送信すると、サーバー上にタスクを保存できる', function () use ($path) {
            $statusCode = HttpStatusCode::CREATED;
            $method = 'POST';
            $requestBody = [
                'taskName' => 'Test',
            ];

            $response = $this->application->withHeaders($this->credential)->json($method, $path, $requestBody);
            $responseBody = $response->json();

            /** @var \App\Models\Task */
            $task = Task::where(['id' => $responseBody['taskId']])->firstOrFail();

            expect($response->getStatusCode())->toBe($statusCode);
            expect($task->name())->toBe('Test');
        });
    });

    describe('401', function () use ($path) {
        it('トークンを付与せず、リクエストを送信するとエラーレスポンスが返る', function () use ($path) {
            $method = 'POST';
            $requestBody = [
                'taskName' => 'Test',
            ];
            $response = $this->application->json($method, $path, $requestBody);

            expect($response->getStatusCode())->toBe(HttpStatusCode::UNAUTHORIZED);
        });
    });

    describe('422', function () {
        it('リクエストボディを指定しない場合、エラーレスポンスが返る', function () {
            $response = $this->application
                ->withHeaders($this->credential)
                ->postJson('/users/current/tasks');

            expect($response->getStatusCode())->toBe(HttpStatusCode::UNPROCESSABLE_ENTITY);
        });

        it('タスク名を空に設定し送信すると、エラーレスポンスが返る', function () {
            $response = $this->application
                ->withHeaders($this->credential)
                ->postJson('/users/current/tasks', [
                    'taskName' => '',
                ]);

            expect($response->getStatusCode())->toBe(HttpStatusCode::UNPROCESSABLE_ENTITY);
        });
    });
});
