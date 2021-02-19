<?php

namespace App\UseCases\User\TaskListAcquisition;

use App\Models\Task;

/**
 * タスクのリストの取得機能を提供する.
 */
final class TaskListAcquisitionUseCase
{
    /**
     * 指定されたユーザーのタスクのリストの取得する.
     *
     * @param int $userId
     *   タスクを保有するユーザーのID.
     * @return array
     *   タスクの配列.
     * @throws \Exception
     *   SQLの実行時に失敗した場合に送出される.
     */
    public function getTasks(int $userId): array
    {
        return Task::where(['user_id' => $userId])->get()->toArray();
    }
}
