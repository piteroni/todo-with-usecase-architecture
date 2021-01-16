<?php

namespace App\Domain\UseCases\User;

use App\Models\Task;

/**
 * タスクの作成機能を提供する.
 */
class TaskCreateUseCase
{
    /**
     * タスクの作成を行う.
     * 
     * @param int $authorId
     *   作成者のID.
     * @param string $taskName
     *   タスク名.
     * @return int
     *   作成したタスクのID.
     */
    public function createTask(int $authorId, string $taskName): int
    {
        $task = Task::create([
            'user_id' => $authorId,
            'name' => $taskName
        ]);

        return $task->id;
    }
}
