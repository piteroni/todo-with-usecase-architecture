<?php

namespace App\Http\Requests;

use App\Exceptions\JsonSerializable;

// リクエスト内容のバリデーションに失敗したことを表す.
class RequestValidateionException extends JsonSerializable
{
}
