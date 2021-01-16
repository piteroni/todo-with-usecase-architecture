<?php

namespace App\Http\Requests;

use App\Exceptions\JsonSerializable;

// 無効なキャストまたは明示的な変換が発生したことを表す.
class InvalidCastException extends JsonSerializable
{
}
