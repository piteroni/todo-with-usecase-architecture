<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Identification\LoginRequest;
use App\Http\Resources\Identification\ApiToken;
use App\Exceptions\Api\BadRequestException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class IdentificationController extends Controller
{
    /**
     * ユーザー認証を行う.
     * 
     * @param $request
     *   リクエストオブジェクト.
     * @return 
     *   認証済みユーザーのAPI Token.
     * @throws \App\Exceptions\Api\UnauthorizedException
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $operationId = $request->route()->getName();

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            throw new BadRequestException($operationId, 'ログインに失敗しました');
        }

        /** @var \App\Models\User */
        $user = Auth::user();
        $apiToken = $user->createToken('apiToken')->plainTextToken;

        return new JsonResponse((new ApiToken($apiToken))->handle());
    }

    /**
     * システムからログアウトを行う.
     * 
     * @return \Illuminate\Http\Request
     *   リクエストオブジェクト.
     * @return \Illuminate\Http\JsonResponse
     *   空レスポンス.
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if (is_null($user)) {
            return new JsonResponse();
        }

        $user->tokens()->delete();

        return new JsonResponse();
    } 
}
