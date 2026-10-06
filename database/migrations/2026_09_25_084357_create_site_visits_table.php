<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_visits', function (Blueprint $table) {
            $table->id();
            $table->string('path')->nullable();
            $table->string('ip', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->date('visited_on');
            $table->timestamps();

            $table->index('visited_on');
            $table->index('path');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_visits');
    }
};