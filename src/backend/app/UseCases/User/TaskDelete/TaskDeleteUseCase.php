<?php

namespace App\UseCases\User\TaskDelete;

use App\Models\Task;

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
     */
    public function deleteTask(int $taskId): void
    {
        Task::find($taskId)->delete();
    }
}
