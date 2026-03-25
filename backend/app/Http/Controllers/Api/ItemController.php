<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Item;

class ItemController extends Controller
{
    public function index()
    {
        return Item::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'nullable|string'
        ]);

        return Item::create($validated);
    }

    public function show($id)
    {
        return Item::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'nullable|string'
        ]);

        $item->update($validated);

        return $item;
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);

        // 🔒 Prevent delete if used in invoice
        if ($item->invoiceItems()->exists()) {
            return response()->json([
                'message' => 'Item is used in invoice, cannot delete'
            ], 400);
        }

        $item->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
