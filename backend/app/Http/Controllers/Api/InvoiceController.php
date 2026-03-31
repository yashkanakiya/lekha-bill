<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    /**
     * 📄 GET /invoices
     * List all invoices
     */
    public function index()
    {
        $invoices = Invoice::with('customer')
            ->latest()
            ->paginate(10);

        return response()->json($invoices);
    }

    /**
     * 📄 GET /invoices/{id}
     * View single invoice
     */
    public function show($id)
    {
        $invoice = Invoice::with(['customer', 'items'])
            ->findOrFail($id);

        return response()->json($invoice);
    }

    /**
     * ➕ POST /invoices
     * Create invoice
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            // 🔥 LOCK + SAFE INVOICE NUMBER GENERATION
            $lastInvoice = Invoice::lockForUpdate()->latest()->first();

            $nextNumber = $lastInvoice
                ? intval(substr($lastInvoice->invoice_number, 4)) + 1
                : 1;

            $invoiceNumber = 'INV-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

            // ✅ Create invoice with number
            $invoice = Invoice::create([
                'customer_id' => $request->customer_id,
                'invoice_number' => $invoiceNumber,
            ]);

            // ✅ Handle items
            $subtotal = $this->handleItems($invoice, $request->items);

            $invoice->update([
                'subtotal' => $subtotal,
                'grand_total' => $subtotal,
            ]);

            DB::commit();

            return response()->json(
                $invoice->load(['customer', 'items']),
                201
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✏️ PUT /invoices/{id}
     * Update invoice
     */
    public function update(Request $request, $id)
    {
        $invoice = Invoice::findOrFail($id);

        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|array|min:1',
        ]);

        DB::beginTransaction();

        try {
            // Update customer
            $invoice->update([
                'customer_id' => $request->customer_id,
            ]);

            // ❗ Delete old items
            $invoice->items()->delete();

            // Add new items
            $subtotal = $this->handleItems($invoice, $request->items);

            $invoice->update([
                'subtotal' => $subtotal,
                'grand_total' => $subtotal,
            ]);

            DB::commit();

            return response()->json($invoice->load(['customer', 'items']));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * ❌ DELETE /invoices/{id}
     */
    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);

        $invoice->delete();

        return response()->json([
            'message' => 'Invoice deleted successfully'
        ]);
    }

    /**
     * 🔥 Reusable Item Calculation Logic
     */
    private function handleItems($invoice, $items)
    {
        $subtotal = 0;

        foreach ($items as $itemData) {

            // 🔒 Always fetch price from DB (IMPORTANT)
            $item = Item::findOrFail($itemData['item_id']);

            $price = $item->price;
            $qty = $itemData['quantity'];

            $total = $price * $qty;

            // Discount
            if (!empty($itemData['discount_value'])) {
                if ($itemData['discount_type'] === 'percentage') {
                    $discount = ($total * $itemData['discount_value']) / 100;
                } else {
                    $discount = $itemData['discount_value'];
                }
                $total -= $discount;
            }

            // Tax
            if (!empty($itemData['tax_percentage'])) {
                $tax = ($total * $itemData['tax_percentage']) / 100;
                $total += $tax;
            }

            $subtotal += $total;

            $invoice->items()->create([
                'item_id' => $item->id,
                'item_name' => $item->name, // snapshot
                'price' => $price,
                'quantity' => $qty,
                'discount_type' => $itemData['discount_type'] ?? null,
                'discount_value' => $itemData['discount_value'] ?? null,
                'tax_percentage' => $itemData['tax_percentage'] ?? null,
                'total' => $total,
            ]);
        }

        return $subtotal;
    }

    public function nextNumber()
    {
        $lastInvoice = Invoice::latest()->first();

        $nextNumber = $lastInvoice
            ? intval(substr($lastInvoice->invoice_number, 4)) + 1
            : 1;

        $formatted = 'INV-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        return response()->json([
            'invoice_number' => $formatted
        ]);
    }
}
