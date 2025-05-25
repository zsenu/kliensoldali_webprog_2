<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'capacity',
        'rows',
        'columns',
        'has_3d'
    ];

    protected $casts = [
        'has_3d' => 'boolean'
    ];

    public function screenings()
    {
        return $this->hasMany(Screening::class);
    }
}
