<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'v0'], function () {
    Route::group(['prefix' => 'identification'], function () {
        Route::post('login', 'App\Http\Controllers\Api\IdentificationController@login')->name('login');
        Route::post('logout', 'App\Http\Controllers\Api\IdentificationController@logout')->name('post-logout');
    });

    Route::group(['prefix' => 'credentials'], function () {
        Route::post('verify', 'App\Http\Controllers\Api\CredentialController@verify')->name('post-credentials-current-verify');
    });

    Route::group(['prefix' => 'users/current'], function () {
        Route::get('/', 'App\Http\Controllers\Api\UserController@getProfile')->name('get-users-current');
        Route::put('/', 'App\Http\Controllers\Api\UserController@updateProfile')->name('put-users-current');
        Route::get('tasks', 'App\Http\Controllers\Api\UserController@getTasks')->name('get-users-current-tasks');
        Route::post('tasks', 'App\Http\Controllers\Api\UserController@createTask')->name('post-users-current-tasks');
        Route::delete('tasks/{taskId}', 'App\Http\Controllers\Api\UserController@deleteTask')->name('delete-users-current-tasks-taskId');
    });
});
