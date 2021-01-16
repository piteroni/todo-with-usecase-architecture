<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * タスクのIDを取得する.
     * 
     * @return int
     *   タスクのID.
     */
    public function id(): int
    {
        return $this->id;
    }

    /**
     * 作成者のユーザーIDを取得する.
     * 
     * @return int
     *   作成者のユーザーID.
     */
    public function userId(): int
    {
        return $this->user_id;
    }

    /**
     * タスク名を取得する.
     * 
     * @return string
     *   タスク名.
     */
    public function name(): string
    {
        return $this->name;
    }
}
