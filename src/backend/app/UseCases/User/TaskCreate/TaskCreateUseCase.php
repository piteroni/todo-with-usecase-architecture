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
     * @return \App\Models\Task
     *   作成したタスク.
     * @throws \Exception
     *   SQLの実行時に失敗した場合に送出される.
     */
    public function createTask(int $authorId, string $taskName): Task
    {
        return Task::create([
            'user_id' => $authorId,
            'name' => $taskName
        ]);
    }
}
