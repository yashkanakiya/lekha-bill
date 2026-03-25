<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    // use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'description'
    ];

    public function invoiceItems() {
        return $this->hasMany(InvoiceItem::class);
    }
}
