<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id',
        'item_id',
        'item_name',
        'price',
        'quantity',
        'has_discount',
        'discount_type',
        'discount_value',
        'has_tax',
        'tax_percentage',
        'total',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
