<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ticket_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price_multiplier', 4, 2);
            $table->timestamps();
        });

        // Insert default ticket types
        DB::table('ticket_types')->insert([
            ['name' => 'normal', 'price_multiplier' => 1.00],
            ['name' => 'student', 'price_multiplier' => 0.75],
            ['name' => 'senior', 'price_multiplier' => 0.80],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_types');
    }
}; 