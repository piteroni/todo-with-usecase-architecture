<?php

use App\UseCases\User\TaskDelete\TaskDeleteAuthorize;
use App\Models\User;
use App\Models\Task;
use App\Exceptions\AuthorizationException;
use Tests\TestCase;

class TaskDeleteAuthorizeTest extends TestCase
{
    /**
     * ユーザーのIDとタスクのIDを渡すと、ユーザーがタスクを削除できる権限を保有しているか検証できる.
     */
    public function testAuthorize(): void
    {
        $taskDeleteAuthorize = new TaskDeleteAuthorize();

        $authorId = User::factory()->create()->id;
        $taskId = Task::factory()->create(['user_id' => $authorId])->id;

        $this->expectNotToPerformAssertions(AuthorizationException::class);

        $taskDeleteAuthorize->authorize($authorId, $taskId);
    }

    /**
     * タスクを作成したユーザー以外のユーザーのIDが渡されると例外が送出される.
     */
    public function testNoAuthorize(): void
    {
        $taskDeleteAuthorize = new TaskDeleteAuthorize();

        $otherId = User::factory()->create()->id;
        $authorId = User::factory()->create()->id;
        $taskId = Task::factory()->create(['user_id' => $authorId])->id;

        $this->expectException(AuthorizationException::class);

        $taskDeleteAuthorize->authorize($otherId, $taskId);
    }
}
