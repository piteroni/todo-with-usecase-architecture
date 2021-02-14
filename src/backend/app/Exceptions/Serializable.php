<?php

namespace App\Exceptions;

use Exception;

class Serializable extends Exception
{
    public function __construct(array $messages)
    {
        parent::__construct(json_encode($messages, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }
}
