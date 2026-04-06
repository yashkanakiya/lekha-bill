import { defineStore } from "pinia";
import api from "../plugins/axios";
import type { Invoice, InvoiceForm, InvoiceItem } from "../types/Invoice";

export const useInvoiceStore = defineStore("invoice", {
  state: () => ({
    invoices: [] as Invoice[],
    invoice: null as Invoice | null,

    invoiceData: {
      customer_id: null,
      invoice_number: "",
      selectedCustomer: null,
      items: [
        {
          selectedItem: null,
          item_id: null,
          item_name: "",
          price: 0,
          quantity: 1,
          discount_type: "fixed",
          discount_value: 0,
          tax_percentage: 0,
        },
      ] as InvoiceItem[],
    } as InvoiceForm,
  }),

  actions: {
    addItem() {
      this.invoiceData.items.push({
        item_id: null,
        item_name: "",
        price: 0,
        quantity: 1,
        discount_type: "fixed",
        discount_value: 0,
        tax_percentage: 0,
      });
    },

    removeItem(index: number) {
      if (index > 0) {
        this.invoiceData.items.splice(index, 1);
      }
    },

    async fetchInvoices() {
      try {
        const response = await api.get("/invoices");
        this.invoices = response.data.data;
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    },

    async fetchInvoice(id: any) {
      try {
        const response = await api.get(`/invoices/${id}`);
        this.invoice = response.data;
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    },

    async createInvoice() {
      try {
        const payload = this.buildPayload();

        const response = await api.post("/invoices", payload);
        this.invoices.push(response.data);

        this.resetForm();
      } catch (error) {
        console.error("Error creating invoice:", error);
      }
    },

    async updateInvoice(id: any) {
      try {
        const payload = this.buildPayload();

        const response = await api.put(`/invoices/${id}`, payload);
        const index = this.invoices.findIndex((c) => c.id === id);
        if (index !== -1) this.invoices[index] = response.data;
      } catch (error) {
        console.error("Error creating invoice:", error);
      }
    },

    async fetchNextInvoiceNumber() {
      try {
        const res = await api.get("/invoices/next-number");
        this.invoiceData.invoice_number = res.data.invoice_number;
      } catch (err) {
        console.error(err);
      }
    },

    async deleteInvoice(id: any) {
      try {
        await api.delete(`/invoice/${id}`);

        this.invoices = this.invoices.filter((c) => c.id !== id);
      } catch (error: any) {
        console.error("Error deleting invoice:", error);
        throw error.response?.data?.message || "Delete failed";
      }
    },

    buildPayload() {
      return {
        customer_id: this.invoiceData.customer_id,
        invoice_number: this.invoiceData.invoice_number,
        items: this.invoiceData.items.map((item) => ({
          item_id: item.item_id,
          quantity: item.quantity,
          price: item.price,
          discount_type: item.discount_type,
          discount_value: item.discount_value,
          tax_percentage: item.tax_percentage,
        })),
      };
    },

    resetForm() {
      this.invoiceData.customer_id = null;
      this.invoiceData.items = [
        {
          item_id: null,
          item_name: "",
          price: 0,
          quantity: 1,
          discount_type: "fixed",
          discount_value: 0,
          tax_percentage: 0,
        },
      ];
    },
  },
});
