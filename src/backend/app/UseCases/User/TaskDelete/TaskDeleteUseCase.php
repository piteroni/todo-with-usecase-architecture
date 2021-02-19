<?php

namespace App\UseCases\User\TaskDelete;

use App\Models\Task;
use Exception;

/**
 * タスクの削除機能を提供する.
 */
final class TaskDeleteUseCase
{
    /**
     * タスクの削除を行う.
     *
     * @param int $taskId
     *   タスクのID.
     * @throws \Exception
     *   SQLの実行時に失敗した場合に送出される.
     */
    public function deleteTask(int $taskId): void
    {
        Task::find($taskId)->delete();
    }
}
