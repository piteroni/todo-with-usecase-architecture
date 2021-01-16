<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    /**
     * ユーザーのIDを取得する.
     * 
     * @return int
     *   ユーザーのID.
     */
    public function id(): int
    {
        return $this->id;
    }

    /**
     * ユーザー名を取得する.
     * 
     * @return string
     *   ユーザー名.
     */
    public function name(): string
    {
        return $this->name;
    }

    /**
     * ユーザーのメールアドレスを取得する.
     * 
     * @return string
     *   ユーザーのメールアドレス.
     */
    public function email(): string
    {
        return $this->email;
    }
}
