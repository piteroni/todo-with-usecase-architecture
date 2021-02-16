<?php

namespace App\Exceptions;

use Exception;
use Throwable;

abstract class Serializable extends Exception
{
    public function __construct(array $messages, $code = null, Throwable $previous = null)
    {
        parent::__construct(json_encode($messages, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $code, $previous);
    }
}
