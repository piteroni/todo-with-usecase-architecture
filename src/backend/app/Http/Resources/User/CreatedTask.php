<?php

namespace App\Http\Resources\User;

use App\Models\Task;
use Illuminate\Http\Resources\Json\JsonResource;

class CreatedTask extends JsonResource
{
    private Task $task;

    /**
     * @param Task $task
     */
    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    public function toArray($request): array
    {
        return [
            'id' => $this->task->id(),
            'name' => $this->task->name()
        ];
    }
}
