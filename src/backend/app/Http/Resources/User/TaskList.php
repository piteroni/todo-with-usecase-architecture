<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;

class TaskList extends JsonResource
{
    private array $tasks;

    /**
     * @param array $tasks
     */
    public function __construct(array $tasks)
    {
        $this->tasks = $tasks;
    }

    public function toArray($request): array
    {
        $taskList = [];

        foreach ($this->tasks as $task) {
            $taskList[] = [
                'id' => $task['id'],
                'name' => $task['name']
            ];
        }

        return $taskList;
    }
}
