<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Task
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Task query()
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereUserId($value)
 * @mixin \Eloquent
 */
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
