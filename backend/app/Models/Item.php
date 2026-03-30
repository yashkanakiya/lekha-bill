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

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    protected static function booted()
    {
        static::deleting(function ($item) {
            if ($item->invoiceItems()->exists()) {
                throw new \Exception('Item is used in invoice.');
            }
        });
    }

}
