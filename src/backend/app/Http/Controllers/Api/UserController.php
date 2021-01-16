<?php

namespace App\Http\Controllers\Api;

use App\Domain\UseCases\User\TaskCreateUseCase;
use App\Enums\HttpStatusCode;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateTaskRequest;
use App\Http\Resources\User\CreatedTaskId;
use App\Exceptions\Api\InternalServerErrorException;
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
     * @param \App\Http\Requests\User\CreateTaskRequest $request
     *   リクエストオブジェクト.
     * @param \App\Domain\UseCases\User\TaskCreateUseCase $taskCreateUseCase
     *   タスク作成ユースケース.
     * @return \Illuminate\Http\JsonResponse
     *   作成したタスクのID.
     * @throws \App\Exceptions\Api\InternalServerErrorException
     *   サーバーで何らかの問題が発生した場合に送出される.
     */
    public function createTask(CreateTaskRequest $request, TaskCreateUseCase $taskCreateUseCase): JsonResponse
    {
        $operationId = $request->route()->getName();

        $authorId = $request->user()->id();
        $taskName = $request->taskName;

        $createdTaskId = null;

        try {
            $createdTaskId = $taskCreateUseCase->createTask($authorId, $taskName);
        } catch (Throwable $e) {
            throw new InternalServerErrorException($operationId, '', $e);
        }

        return new JsonResponse((new CreatedTaskId($createdTaskId))->handle(), HttpStatusCode::CREATED);
    }
}
