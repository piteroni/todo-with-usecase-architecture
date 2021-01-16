<?php

use App\Domain\UseCases\User\TaskCreateUseCase;
use App\Models\User;
use App\Models\Task;

describe('TaskCreateUseCase.php', function () {
    it('作成者のIDとタスク名を渡すと、データベースにタスクを保存できる', function () {
        $authorId = User::factory()->create()->id;
        $taskName = '34a96501ddc10e38821816f29c2b49b9bfad92fafa';

        $taskId = (new TaskCreateUseCase())->createTask($authorId, $taskName);

        $task = Task::find($taskId);

        expect($task)->not->toBeNull();
        expect($task->name)->toBe($taskName);
    });
});
