<?php

namespace App\Http\Controllers\Api;

use App\Http\HttpStatusCode;
use App\Http\Controllers\Controller;
use App\Http\Requests\Identification\LoginRequest;
use App\Http\Resources\Identification\ApiToken;
use App\Exceptions\Api\UnauthorizedException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class IdentificationController extends Controller
{
    /**
     * ログイン処理を行う.
     *
     * @param \App\Http\Requests\Identification\LoginRequest $request
     *   リクエストオブジェクト.
     * @return \Illuminate\Http\JsonResponse
     *   認証済みユーザーのAPI Token.
     * @throws \App\Exceptions\Api\UnauthorizedException
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $operationId = $request->route()->getName();

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            throw new UnauthorizedException($operationId, 'ログインに失敗しました');
        }

        /** @var \App\Models\User */
        $user = Auth::user();
        $apiToken = $user->createToken('apiToken')->plainTextToken;

        return response()->json(new ApiToken($apiToken), HttpStatusCode::OK);
    }

    /**
     * ログアウト処理を行う.
     *
     * @return \Illuminate\Http\Request
     *   リクエストオブジェクト.
     * @return \Illuminate\Http\JsonResponse
     *   空レスポンス.
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user !== null) {
            $user->tokens()->delete();
        }

        return response()->json();
    }
}
