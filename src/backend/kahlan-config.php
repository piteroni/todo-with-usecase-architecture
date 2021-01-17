<?php

use Tests\Application;
use Kahlan\Filter\Filters;

Filters::apply($this, 'run', function ($next) {
    /** @var \Kahlan\Scope\Group $root */
    $root = static::suite()->root();
    /** @var \Kahlan\Scope $scope */
    $scope = $root->scope();
    $scope->application = new Application();

    $root->beforeAll(function() use ($scope) {
        $scope->application->setUp();
    });

    $root->beforeEach(function() use ($scope) {
        $scope->application->setUp();
    });

    $root->afterEach(function() use ($scope) {
        $scope->application->tearDown();
        $scope->application->refreshApplication();
    });

    return $next();
});
