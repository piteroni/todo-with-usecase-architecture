<?php

namespace App\Http\Controllers\Api;

use App\UseCases\User\ProfileAcquisition\ProfileAcquisitionUseCase;
use App\UseCases\User\TaskCreate\TaskCreateUseCase;
use App\UseCases\User\TaskDelete\TaskDeleteAuthorize;
use App\UseCases\User\TaskDelete\TaskDeleteUseCase;
use App\UseCases\User\TaskListAcquisition\TaskListAcquisitionUseCase;
use App\Http\HttpStatusCode;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\TaskCreateRequest;
use App\Http\Requests\User\ProfileUpdateRequest;
use App\Http\Resources\User\CreatedTask;
use App\Http\Resources\User\TaskList;
use App\Exceptions\AuthorizationException;
use App\Exceptions\Api\ForbiddenException;
use App\Exceptions\Api\InternalServerErrorException;
use App\UseCases\User\ProfileUpdate\ProfileUpdateUseCase;
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
     * ログインユーザーのユーザー情報を取得する.
     *
     * @param \Illuminate\Http\Request $request
     *   リクエストオブジェクト.
     * @return \Illuminate\Http\JsonResponse
     *   ログインユーザーのユーザー情報.
     * @throws \App\Exceptions\Api\InternalServerErrorException
     *   サーバーで何らかの問題が発生した場合に送出される.
     */
    public function getProfile(Request $request): JsonResponse
    {
        $profileAcquisitionUseCase = new ProfileAcquisitionUseCase();

        $operationId = $request->route()->getName();

        $profile = null;

        try {
            $profile = $profileAcquisitionUseCase->getProfile();
        } catch (Throwable $e) {
            throw new InternalServerErrorException($operationId, '', $e);
        }

        return response()->json($profile, HttpStatusCode::OK);
    }

    /**
     * ログインユーザーのユーザー情報を更新する.
     *
     * @param \App\Http\Requests\User\ProfileUpdateRequest $request
     *   リクエストオブジェクト.
     * @return \Illuminate\Http\JsonResponse
     *   更新後のユーザー情報.
     */
    public function updateProfile(ProfileUpdateRequest $request): JsonResponse
    {
        $profileUpdateUseCase = new ProfileUpdateUseCase();

        $params = $request->only(['username', 'email', 'password']);

        $profile = $profileUpdateUseCase->updateProfile($params);

        return response()->json($profile, HttpStatusCode::OK);
    }

    /**
     * タスクの作成を行う.
     *
     * @param \App\Http\Requests\User\TaskCreateRequest $request
     *   リクエストオブジェクト.
     * @return \Illuminate\Http\JsonResponse
     *   作成したタスクのID.
     * @throws \App\Exceptions\Api\InternalServerErrorException
     *   サーバーで何らかの問題が発生した場合に送出される.
     */
    public function createTask(TaskCreateRequest $request): JsonResponse
    {
        $taskCreateUseCase = new TaskCreateUseCase();

        $operationId = $request->route()->getName();

        $authorId = $request->user()->id;
        $taskName = $request->get('taskName');

        try {
            $createdTask = $taskCreateUseCase->createTask($authorId, $taskName);
        } catch (Throwable $e)  {
            throw new InternalServerErrorException($operationId, '', $e);
        }

        return response()->json(new CreatedTask($createdTask), HttpStatusCode::CREATED);
    }

    /**
     * タスクのリストの取得を行う.
     *
     * @param \Illuminate\Http\Request $request
     *   リクエストオブジェクト.
     * @return \Illuminate\Http\JsonResponse
     *   タスクのリスト.
     * @throws \App\Exceptions\Api\InternalServerErrorException
     *   SQLの実行時に失敗した場合に送出される.
     */
    public function getTasks(Request $request): JsonResponse
    {
        $taskListAcquisitionUseCase = new TaskListAcquisitionUseCase();

        $operationId = $request->route()->getName();

        $authorId = $request->user()->id;

        $tasks = null;

        try {
            $tasks = $taskListAcquisitionUseCase->getTasks($authorId);
        } catch (Throwable $e) {
            throw new InternalServerErrorException($operationId, '', $e);
        }

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
        $taskDeleteUseCase = new TaskDeleteUseCase();
        $taskDeleteAuthorize = new TaskDeleteAuthorize();

        $operationId = $request->route()->getName();

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
