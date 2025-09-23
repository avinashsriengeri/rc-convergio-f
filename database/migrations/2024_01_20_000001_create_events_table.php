<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type'); // webinar, conference, workshop, demo, meeting, networking, training
            $table->string('status')->default('upcoming'); // upcoming, completed, cancelled, draft
            $table->timestamp('scheduled_at');
            $table->integer('duration')->default(60); // in minutes
            $table->string('location')->nullable();
            $table->integer('max_attendees')->nullable();
            $table->unsignedBigInteger('owner_id');
            $table->unsignedBigInteger('tenant_id')->nullable();
            $table->json('settings')->nullable();
            $table->string('zoom_meeting_id')->nullable();
            $table->string('zoom_password')->nullable();
            $table->text('zoom_join_url')->nullable();
            $table->boolean('recording_enabled')->default(false);
            $table->boolean('auto_reminder')->default(true);
            $table->boolean('waiting_room')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('owner_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            
            $table->index(['tenant_id', 'scheduled_at']);
            $table->index(['type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};

