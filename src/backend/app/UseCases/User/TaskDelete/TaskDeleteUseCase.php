<?php

namespace App\UseCases\User\TaskDelete;

use App\Exceptions\Core\InvalidArgumentException;
use App\Exceptions\EloquentException;
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
     * @throws \App\Exceptions\EloquentException
     *   タスクの削除時にプライマリキーが存在しない場合に送出される.
     * @throws \App\Exceptions\Core\InvalidArgumentException
     *   指定されたタスクが存在しない場合に送出される.
     */
    public function deleteTask(int $taskId): void
    {
        $task = Task::find($taskId);

        if (is_null($task)) {
            throw new InvalidArgumentException([
                'message' => '指定されたタスクは存在しません',
                'taskId' => $taskId
            ]);
        }

        try {
            $task->delete();
        } catch (Exception $e) {
            throw new EloquentException($e->getMessage(), 0, $e);
        }
    }
}
