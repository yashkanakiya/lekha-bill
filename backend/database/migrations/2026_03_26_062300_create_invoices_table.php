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
        Schema::create('invoices', function (Blueprint $table) {
        $table->id();

        $table->foreignId('customer_id')->constrained()->restrictOnDelete();

        $table->string('invoice_number')->unique();

        $table->decimal('sub_total', 12, 2)->default(0);
        $table->decimal('discount_total', 12, 2)->default(0);
        $table->decimal('tax_total', 12, 2)->default(0);
        $table->decimal('grand_total', 12, 2)->default(0);

        $table->boolean('is_discount_enabled')->default(false);
        $table->boolean('is_tax_enabled')->default(false);

        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
