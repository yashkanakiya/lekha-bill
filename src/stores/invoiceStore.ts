import { defineStore } from "pinia";
import api from "../plugins/axios";

export const useInvoiceStore = defineStore("invoice", {
  state: () => ({
    invoices: [],
    invoice: null,

    invoiceData: {
      customer_id: null,
      invoice_number: "",
      selectedCustomer: null, // UI only
      invoice_number: "",
      items: [
        {
          selectedItem: null, // UI only
          item_id: null,
          item_name: "",
          price: 0,
          quantity: 1,
          discount_type: "fixed", // 'percentage' | 'fixed'
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

    async fetchInvoice(id) {
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

    async updateInvoice(id) {
      try {
        const payload = this.buildPayload();

        const response = await api.put(`/invoices/${id}`, payload);
        const index = this.invoices.findIndex((c) => c.id === id);
        if (index !== -1) this.invoices[index] = response.data;
      } catch (error) {
        console.error("Error creating invoice:", error);
      }
    },

    // updateCustomer(id, params) {
    //   api
    //     .put(`/customers/${id}`, params)
    //     .then((response) => {
    //       const index = this.customers.findIndex((c) => c.id === id);
    //       if (index !== -1) this.customers[index] = response.data;
    //     })
    //     .catch((error) => {
    //       console.error("Error updating customer:", error);
    //     });
    // },

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
          discount_type: "fixed",
          discount_value: 0,
          tax_percentage: 0,
        },
      ];
    },
  },
});
