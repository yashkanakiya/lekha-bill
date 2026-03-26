<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'rate',
    ];

    protected $casts = [
        'rate' => 'decimal:2',
    ];

    public function invoices()
    {
        return $this->belongsToMany(Invoice::class)
            ->withPivot('amount');
    }
}
