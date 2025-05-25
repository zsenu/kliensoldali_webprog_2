<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Movie extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image_path',
        'duration',
        'genre',
        'release_year'
    ];

    protected $casts = [
        'duration' => 'integer',
        'release_year' => 'integer'
    ];

    public function screenings()
    {
        return $this->hasMany(Screening::class);
    }
}
