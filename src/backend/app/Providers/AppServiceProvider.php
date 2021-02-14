<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(\App\UseCases\User\TaskCreate\TaskCreateUseCase::class);
        $this->app->bind(\App\UseCases\User\TaskDelete\TaskDeleteUseCase::class);
        $this->app->bind(\App\UseCases\User\TaskListAcquisition\TaskListAcquisition::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
