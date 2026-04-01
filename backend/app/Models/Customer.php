<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
    ];

      public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    protected static function booted()
    {
        static::deleting(function ($customer) {
            if ($customer->invoices()->exists()) {
                throw new \Exception('Customer has invoices, cannot delete.');
            }
        });
    }

}
