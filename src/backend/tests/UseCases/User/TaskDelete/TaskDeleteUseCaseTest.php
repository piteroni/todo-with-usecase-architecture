<?php

use App\UseCases\User\TaskDelete\TaskDeleteUseCase;
use App\Models\User;
use App\Models\Task;
use Illuminate\Auth\Access\AuthorizationException;
use Tests\TestCase;

class TaskDeleteUseCaseTest extends TestCase
{
    /**
     * タスクのIDを渡すと、データベースからタスクを削除出来る.
     */
    public function testDeleteTask(): void
    {
        $authorId = User::factory()->create()->id;
        $taskId = Task::factory()->create(['user_id' => $authorId])->id;

        (new TaskDeleteUseCase())->deleteTask($authorId, $taskId);

        $task = Task::find($taskId);

        $this->assertNull($task);
    }

    public function testNoAuthorize(): void
    {
        $otherId = User::factory()->create()->id;
        $authorId = User::factory()->create()->id;
        $taskId = Task::factory()->create(['user_id' => $authorId])->id;

        $this->expectException(AuthorizationException::class);

        (new TaskDeleteUseCase())->deleteTask($otherId, $taskId);
    }
}
