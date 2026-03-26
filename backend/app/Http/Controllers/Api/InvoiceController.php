<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Invoice;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with('customer')
            ->latest()
            ->paginate(10);

        return response()->json($invoices);
    }
    public function show($id)
    {
        $invoice = Invoice::with([
            'customer',
            'items',
            'taxes'
        ])->findOrFail($id);

        return response()->json($invoice);
    }
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|array|min:1',
        ]);

        DB::beginTransaction();

        try {
            $invoice = Invoice::create([
                'customer_id' => $request->customer_id,
                'invoice_number' => 'INV-' . time(),
                'is_discount_enabled' => $request->is_discount_enabled ?? false,
                'is_tax_enabled' => $request->is_tax_enabled ?? false,
            ]);

            $totals = $this->handleItems($invoice, $request);

            $taxTotal = $this->handleTaxes($invoice, $request, $totals);

            $invoice->update([
                'sub_total' => $totals['sub_total'],
                'discount_total' => $totals['discount_total'],
                'tax_total' => $taxTotal,
                'grand_total' => ($totals['sub_total'] - $totals['discount_total']) + $taxTotal,
            ]);

            DB::commit();

            return response()->json($invoice->load('items', 'taxes'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function update(Request $request, $id)
    {
        $invoice = Invoice::findOrFail($id);

        DB::beginTransaction();

        try {
            $invoice->update([
                'customer_id' => $request->customer_id,
                'is_discount_enabled' => $request->is_discount_enabled ?? false,
                'is_tax_enabled' => $request->is_tax_enabled ?? false,
            ]);

            // ❌ Remove old data
            $invoice->items()->delete();
            $invoice->taxes()->detach();

            // ✅ Recreate
            $totals = $this->handleItems($invoice, $request);

            $taxTotal = $this->handleTaxes($invoice, $request, $totals);

            $invoice->update([
                'sub_total' => $totals['sub_total'],
                'discount_total' => $totals['discount_total'],
                'tax_total' => $taxTotal,
                'grand_total' => ($totals['sub_total'] - $totals['discount_total']) + $taxTotal,
            ]);

            DB::commit();

            return response()->json($invoice->load('items', 'taxes'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);

        $invoice->delete();

        return response()->json([
            'message' => 'Invoice deleted successfully'
        ]);
    }

    private function handleItems($invoice, $request)
    {
        $subTotal = 0;
        $discountTotal = 0;

        foreach ($request->items as $item) {
            $lineTotal = $item['price'] * $item['quantity'];

            $discount = 0;

            if ($request->is_discount_enabled) {
                if ($item['discount_type'] === 'percentage') {
                    $discount = ($lineTotal * $item['discount']) / 100;
                } else {
                    $discount = $item['discount'];
                }
            }

            $total = $lineTotal - $discount;

            $invoice->items()->create([
                'item_id' => $item['item_id'],
                'name' => $item['name'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
                'discount' => $discount,
                'discount_type' => $item['discount_type'],
                'total' => $total,
            ]);

            $subTotal += $lineTotal;
            $discountTotal += $discount;
        }

        return [
            'sub_total' => $subTotal,
            'discount_total' => $discountTotal
        ];
    }
    private function handleTaxes($invoice, $request, $totals)
    {
        $taxTotal = 0;

        if (!$request->is_tax_enabled) {
            return 0;
        }

        foreach ($request->taxes as $tax) {
            $amount = ($totals['sub_total'] - $totals['discount_total']) * ($tax['rate'] / 100);

            $invoice->taxes()->attach($tax['id'], [
                'amount' => $amount
            ]);

            $taxTotal += $amount;
        }

        return $taxTotal;
    }
}
