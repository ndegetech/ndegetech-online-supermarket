<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteVisit extends Model
{
    protected $fillable = [
        'path',
        'ip',
        'user_agent',
        'visited_on',
    ];

    protected $casts = [
        'visited_on' => 'date',
    ];
}