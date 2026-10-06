<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductView extends Model
{
    protected $fillable = [
        'product_id',
        'ip_address',
        'user_agent',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}