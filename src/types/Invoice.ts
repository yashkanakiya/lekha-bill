import type Customer from "./Customer";

// types/invoice.ts

export type DiscountType = "fixed" | "percentage";

// ----------------------
// Invoice Item (UI + API)
// ----------------------
export interface InvoiceItem {
  // UI only
  selectedItem?: any | null;

  // API fields
  item_id: number | null;
  item_name?: string;
  price: number;
  quantity: number;
  discount_type: DiscountType;
  discount_value: number;
  tax_percentage: number;

  total?: number;
  id?: number;
}

// ----------------------
// Invoice Form (Frontend)
// ----------------------
export interface InvoiceForm {
  customer_id: number | null;
  invoice_number: string;

  // UI only
  selectedCustomer?: any | null;

  items: InvoiceItem[];
}

// ----------------------
// Invoice (Backend Response)
// ----------------------
export interface Invoice {
  id: number;
  customer_id: number;
  invoice_number: string;

  customer: Customer;

  items: InvoiceItem[];

  created_at?: string;
  updated_at?: string;
  grand_total: number;
}
