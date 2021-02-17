<?php

return [
    'write_model_magic_where' => true,
    'model_locations' => [
        'app/Models',
    ],
    'extra' => [
        'Eloquent' => ['Illuminate\Database\Eloquent\Builder', 'Illuminate\Database\Query\Builder'],
        'Session' => ['Illuminate\Session\Store'],
        'Cookie' => ['Illuminate\Support\Facades\Cookie'],
    ],
];
