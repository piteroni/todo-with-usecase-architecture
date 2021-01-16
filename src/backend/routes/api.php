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

    Route::group(['prefix' => 'credentials/current'], function () {
        Route::post('verify', 'App\Http\Controllers\Api\CredentialController@verify')->name('post-credentials-current-verify');
    });

    Route::group(['prefix' => 'users/current'], function () {
        Route::get('credentials/verify', 'App\Http\Controllers\Api\CredentialController@verify')->name('put-users-current-credentials-verify');

        Route::post('tasks', 'App\Http\Controllers\Api\UserController@createTask')->name('post-users-current-tasks');
    });
});
