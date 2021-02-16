<?php

use App\UseCases\User\TaskListAcquisition\TaskListAcquisitionUseCase;
use App\Models\User;
use App\Models\Task;
use Tests\TestCase;

class TaskListAcquisitionUseCaseTest extends TestCase
{
    /**
     * ユーザーが保有するタスクを取得できる.
     */
    public function testGetTasks(): void
    {
        $taskListAcquisitionUseCase = new TaskListAcquisitionUseCase();

        $authorId = User::factory()->create()->id;
        $expected = Task::factory(5)->create(['user_id' => $authorId])->toArray();

        $actual = $taskListAcquisitionUseCase->getTasks($authorId);

        $this->assertCount(5, $actual);
        $this->assertEquals($expected, $actual);
    }
}
