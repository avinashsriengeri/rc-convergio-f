<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('journey_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained()->onDelete('cascade');
            $table->string('event_type'); // contact_created, company_created, deal_created, deal_updated, activity_created, email_sent, email_opened, email_clicked
            $table->string('event_source'); // form_submission, buyer_intent, manual
            $table->json('details')->nullable();
            $table->string('related_model_type')->nullable();
            $table->unsignedBigInteger('related_model_id')->nullable();
            $table->timestamps();
            
            $table->index(['contact_id', 'event_type']);
            $table->index(['related_model_type', 'related_model_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('journey_events');
    }
};
