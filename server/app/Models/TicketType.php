<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TicketType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price_multiplier'
    ];

    protected $casts = [
        'price_multiplier' => 'decimal:2'
    ];
} 