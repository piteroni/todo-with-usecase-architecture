<?php

use Tests\Application;
use Tests\ApiTestContext;
use Kahlan\Filter\Filters;

Filters::apply($this, 'run', function ($next) {
    /** @var \Kahlan\Scope\Group $root */
    $root = static::suite()->root();
    /** @var \Kahlan\Scope $scope */
    $scope = $root->scope();
    $scope->application = new Application();
    $scope->apiTestContext = new ApiTestContext();

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

    $root->afterAll(function () {
        if (count($this->apiTestContext->contexts()) !== 0) {
            $this->apiTestContext->dump();
        }
    });

    return $next();
});
