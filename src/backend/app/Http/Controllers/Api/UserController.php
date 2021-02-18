<?php

namespace App\Http\Controllers\Api;

use App\UseCases\User\TaskCreate\TaskCreateUseCase;
use App\UseCases\User\TaskDelete\TaskDeleteAuthorize;
use App\UseCases\User\TaskDelete\TaskDeleteUseCase;
use App\UseCases\User\TaskListAcquisition\TaskListAcquisitionUseCase;
use App\Http\HttpStatusCode;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\TaskCreateRequest;
use App\Http\Resources\User\CreatedTaskId;
use App\Http\Resources\User\TaskList;
use App\Exceptions\AuthorizationException;
use App\Exceptions\Api\ForbiddenException;
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
     * @return \Illuminate\Http\JsonResponse
     *   作成したタスクのID.
     */
    public function createTask(TaskCreateRequest $request): JsonResponse
    {
        $taskCreateUseCase = new TaskCreateUseCase();

        $authorId = $request->user()->id;
        $taskName = $request->get('taskName');

        $createdTaskId = null;

        $createdTaskId = $taskCreateUseCase->createTask($authorId, $taskName);

        return response()->json(new CreatedTaskId($createdTaskId), HttpStatusCode::CREATED);
    }

    /**
     * タスクのリストの取得を行う.
     *
     * @param \Illuminate\Http\Request $request
     *   リクエストオブジェクト.
     * @return \Illuminate\Http\JsonResponse
     *   タスクのリスト.
     */
    public function getTasks(Request $request): JsonResponse
    {
        $taskListAcquisitionUseCase = new TaskListAcquisitionUseCase();

        $authorId = $request->user()->id;

        $tasks = $taskListAcquisitionUseCase->getTasks($authorId);

        return response()->json(new TaskList($tasks), HttpStatusCode::OK);
    }

    /**
     * タスクの削除を行う.
     *
     * @param \Illuminate\Http\Request $request
     *   リクエストオブジェクト.
     * @param int $taskId
     *   削除対象となるタスクのID.
     * @return \Illuminate\Http\JsonResponse
     *   空のレスポンス.
     * @throws \App\Exceptions\Api\ForbiddenException
     *   タスクの削除権限がない場合に送出される.
     * @throws \App\Exceptions\Api\InternalServerErrorException
     *   サーバーで何らかの問題が発生した場合に送出される.
     */
    public function deleteTask(Request $request, int $taskId): JsonResponse
    {
        $operationId = $request->route()->getName();
        $taskDeleteAuthorize = new TaskDeleteAuthorize();
        $taskDeleteUseCase = new TaskDeleteUseCase();

        $authorId = $request->user()->id;

        try {
            $taskDeleteAuthorize->authorize($authorId, $taskId);
        } catch (AuthorizationException $e) {
            throw new ForbiddenException($operationId, '', $e);
        }

        try {
            $taskDeleteUseCase->deleteTask($taskId);
        } catch (Throwable $e) {
            throw new InternalServerErrorException($operationId, '', $e);
        }

        return response()->json(null, HttpStatusCode::NO_CONTENT);
    }
}
