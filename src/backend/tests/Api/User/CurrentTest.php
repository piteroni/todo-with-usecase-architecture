<?php

use App\Models\User;
use App\Models\Task;
use App\Enums\HttpStatusCode;

describe('/users/current/tasks', function () {
    beforeEach(function () {
        $user = User::factory()->create();

        $this->credential = [
            'Authorization' => 'Bearer ' . $user->createToken('apiToken')->plainTextToken
        ];
    });

    describe(HttpStatusCode::CREATED, function () {
        it('タスクを送信すると、サーバー上にタスクを保存できる', function () {
            $response = $this->application
                ->withHeaders($this->credential)
                ->postJson('/users/current/tasks', [
                    'taskName' => 'Test',
                ]);

            $payload = $response->json();

            /** @var \App\Models\Task */
            $task = Task::where(['id' => $payload['taskId']])->firstOrFail();

            expect($response->getStatusCode())->toBe(HttpStatusCode::CREATED);
            expect($task->name())->toBe('Test');
        });
    });

    describe(HttpStatusCode::UNAUTHORIZED, function () {
        it('トークンを付与せず、リクエストを送信するとエラーレスポンスが返る', function () {
            $response = $this->application
                ->postJson('/users/current/tasks', [
                    'taskName' => 'Test',
                ]);

            expect($response->getStatusCode())->toBe(HttpStatusCode::UNAUTHORIZED);
        });
    });

    describe(HttpStatusCode::UNPROCESSABLE_ENTITY, function () {
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
