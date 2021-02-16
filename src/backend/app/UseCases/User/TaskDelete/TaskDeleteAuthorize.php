<?php

namespace App\UseCases\User\TaskDelete;

use App\Exceptions\AuthorizationException;
use App\Models\Task;

/**
 * タスク削除に関する認可処理を提供する.
 */
final class TaskDeleteAuthorize
{
    /**
     * タスク削除に関する認可処理を行う.
     *
     * @param int $userId
     *   ユーザーのID.
     * @param int $taskId
     *   タスクのID.
     * @throws \App\Exceptions\AuthorizationException
     *   タスクの削除権限がない場合に送出される.
     */
    public function authorize(int $userId, int $taskId): void
    {
        $rows = Task::where(['id' => $taskId, 'user_id' => $userId])->get();

        if ($rows->isEmpty()) {
            throw new AuthorizationException([
                'message' => '削除権限がありません',
                'userId' => $userId
            ]);
        }
    }
}
