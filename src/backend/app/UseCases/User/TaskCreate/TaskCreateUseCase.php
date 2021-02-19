<?php

namespace App\UseCases\User\TaskCreate;

use App\Models\Task;

/**
 * タスクの作成機能を提供する.
 */
final class TaskCreateUseCase
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
     * @throws \Exception
     *   SQLの実行時に失敗した場合に送出される.
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
