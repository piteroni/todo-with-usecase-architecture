<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class CredentialController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * クライエントから送信された資格情報が有効であるか検証する.
     * 
     * @return
     *   空のレスポンス.
     */
    public function verify(): JsonResponse
    {
        return new JsonResponse();
    }
}
