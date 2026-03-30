import { defineStore } from "pinia";
import api from "../plugins/axios";

export const useInvoiceStore = defineStore("invoice", {
  state: () => ({
    invoices: [],

    invoiceData: {
      customer_id: null,
      invoice_number: "",
      items: [
        {
          item_id: null,
          item_name: "",
          price: 0,
          quantity: 1,
          discount_type: null, // 'percentage' | 'fixed'
          discount_value: 0,
          tax_percentage: 0,
        },
      ],
    },
  }),

  actions: {
    addItem() {
      this.invoiceData.items.push({
        item_id: null,
        item_name: "",
        price: 0,
        quantity: 1,
        discount_type: null,
        discount_value: 0,
        tax_percentage: 0,
      });
    },

    removeItem(index: number) {
      this.invoiceData.items.splice(index, 1);
    },

    async fetchInvoices() {
      try {
        const response = await api.get("/invoices");
        this.invoices = response.data;
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

    async fetchNextInvoiceNumber() {
      try {
        const res = await api.get("/invoices/next-number");
        this.invoiceData.invoice_number = res.data.invoice_number;
      } catch (err) {
        console.error(err);
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
          discount_type: null,
          discount_value: 0,
          tax_percentage: 0,
        },
      ];
    },
  },
});
