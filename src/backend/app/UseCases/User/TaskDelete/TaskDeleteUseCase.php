<?php

namespace App\UseCases\User\TaskDelete;

use App\Models\Task;
use Illuminate\Auth\Access\AuthorizationException;

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
     * @throws \Illuminate\Auth\Access\AuthorizationException
     *   タスクの削除権限がない場合に送出される.
     */
    public function deleteTask(int $authorId, int $taskId): void
    {
        $rows = Task::where(['id' => $taskId, 'user_id' => $authorId])->get();

        if ($rows->isEmpty()) {
            throw new AuthorizationException('削除権限がありません: ' . $authorId);
        }

        Task::find($taskId)->delete();
    }
}
