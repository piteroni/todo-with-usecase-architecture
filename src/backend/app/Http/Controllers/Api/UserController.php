<?php

namespace App\Http\Controllers\Api;

use App\UseCases\User\TaskCreate\TaskCreateUseCase;
use App\UseCases\User\TaskDelete\TaskDeleteUseCase;
use App\Enums\HttpStatusCode;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\TaskCreateRequest;
use App\Http\Resources\User\CreatedTaskId;
use App\Exceptions\Api\InternalServerErrorException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Throwable;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * タスクの作成を行う.
     *
     * @param \App\Http\Requests\User\TaskCreateRequest $request
     *   リクエストオブジェクト.
     * @param \App\UseCases\User\TaskCreate\TaskCreateUseCase $taskCreateUseCase
     *   タスク作成ユースケース.
     * @return \Illuminate\Http\JsonResponse
     *   作成したタスクのID.
     * @throws \App\Exceptions\Api\InternalServerErrorException
     *   サーバーで何らかの問題が発生した場合に送出される.
     */
    public function createTask(TaskCreateRequest $request, TaskCreateUseCase $taskCreateUseCase): JsonResponse
    {
        $operationId = $request->route()->getName();

        $authorId = $request->user()->id;
        $taskName = $request->taskName;

        $createdTaskId = null;

        try {
            $createdTaskId = $taskCreateUseCase->createTask($authorId, $taskName);
        } catch (Throwable $e) {
            throw new InternalServerErrorException($operationId, '', $e);
        }

        return new JsonResponse((new CreatedTaskId($createdTaskId))->handle(), HttpStatusCode::CREATED);
    }

    /**
     * タスクの削除を行う.
     *
     * @param \App\Http\Requests\User\CreateTaskRequest $request
     *   リクエストオブジェクト.
     * @param int $taskId
     *   削除対象となるタスクのID.
     * @param \App\UseCases\User\TaskDelete\TaskDeleteUseCase $taskDeleteUseCase
     *   タスク削除cユースケース.
     * @return \Illuminate\Http\JsonResponse
     *   空のレスポンス.
     * @throws \App\Exceptions\Api\InternalServerErrorException
     *   サーバーで何らかの問題が発生した場合に送出される.
     */
    public function deleteTask(Request $request, int $taskId, TaskDeleteUseCase $taskDeleteUseCase): JsonResponse
    {
        $operationId = $request->route()->getName();

        $authorId = $request->user()->id;

        try {
            $taskDeleteUseCase->deleteTask($authorId, $taskId);
        } catch (Throwable $e) {
            throw new InternalServerErrorException($operationId, '', $e);
        }

        return new JsonResponse(null, HttpStatusCode::NO_CONTENT);
    }
}
