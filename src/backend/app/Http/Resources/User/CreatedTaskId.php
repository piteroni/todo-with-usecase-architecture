<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;

class CreatedTaskId extends JsonResource
{
    private int $taskId;

    /**
     * @param int $taskId
     */
    public function __construct(int $taskId)
    {
        $this->taskId = $taskId;
    }

    public function handle(): array
    {
        return [
            'taskId' => $this->taskId
        ];
    }
}
