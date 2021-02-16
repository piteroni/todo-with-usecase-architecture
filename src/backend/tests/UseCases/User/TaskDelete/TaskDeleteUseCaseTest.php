<?php

use App\UseCases\User\TaskDelete\TaskDeleteUseCase;
use App\Models\User;
use App\Models\Task;
use Tests\TestCase;

class TaskDeleteUseCaseTest extends TestCase
{
    /**
     * タスクのIDを渡すと、データベースからタスクを削除出来る.
     */
    public function testDeleteTask(): void
    {
        $taskDeleteUseCase = new TaskDeleteUseCase();

        $authorId = User::factory()->create()->id;
        $taskId = Task::factory()->create(['user_id' => $authorId])->id;

        $taskDeleteUseCase->deleteTask($taskId);

        $task = Task::find($taskId);

        $this->assertNull($task);
    }
}
