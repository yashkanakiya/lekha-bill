<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'customer_id',
        'invoice_number',
        'sub_total',
        'discount_total',
        'tax_total',
        'grand_total',
        'is_discount_enabled',
        'is_tax_enabled'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function taxes()
    {
        return $this->belongsToMany(Tax::class)
            ->withPivot('amount');
    }
}
