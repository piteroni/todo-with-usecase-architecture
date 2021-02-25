<?php

use App\UseCases\User\TaskCreate\TaskCreateUseCase;
use App\Models\User;
use App\Models\Task;
use Tests\TestCase;

class TaskCreateUseCaseTest extends TestCase
{
    /**
     * 作成者のIDとタスク名を渡すと、データベースにタスクを保存できる.
     */
    public function testCreateTask(): void
    {
        $taskCreateUseCase = new TaskCreateUseCase();
        $authorId = User::factory()->create()->id;
        $taskName = '34a96501ddc10e38821816f29c2b49b9bfad92fafa';

        $task = $taskCreateUseCase->createTask($authorId, $taskName);
        $task = Task::find($task->id());

        $this->assertNotNull($task);
        $this->assertSame($taskName, $task->name);
    }
}
