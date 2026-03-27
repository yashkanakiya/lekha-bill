// import { defineStore } from "pinia";
// import api from "../plugins/axios";

// export const useInvoiceStore = defineStore("invoice", {
//   state: () => {
//     return {
//       invoices: [],
//       invoice: null,
//     };
//   },

//   actions: {
//     fetchInvoices() {
//       api
//         .get("/invoices")
//         .then((response) => {
//           this.invoices = response.data;
//         })
//         .catch((error) => {
//           console.error("Error fetching customers:", error);
//         });
//     },

//     addInvoice(params) {
//       api
//         .post("/invoices", params)
//         .then((response) => {
//           this.invoices.push(response.data);
//         })
//         .catch((error) => {
//           console.error("Error adding customer:", error);
//         });
//     },
//   },
// });

import { defineStore } from "pinia";
import api from "../plugins/axios";

export const useInvoiceStore = defineStore("invoice", {
  state: () => ({
    invoices: [],
    invoice: null,

    invoiceForm: {
      customer_id: null,
      invoice_number: "",
      items: [],
      taxes: [],

      is_discount_enabled: false,
      is_tax_enabled: false,

      sub_total: 0,
      discount_total: 0,
      tax_total: 0,
      grand_total: 0,
    },
  }),

  actions: {
    // ------------------------
    // ITEM MANAGEMENT
    // ------------------------
    addItem(item = null) {
      this.invoiceForm.items.push({
        item_id: item?.id || null,
        name: item?.name || "",
        price: item?.price || 0,
        quantity: 1,
        discount: 0,
        discount_type: "fixed",
        is_discount_enabled: false,
        tax: 0,
        is_tax_enabled: false,
        total: 0,
      });

      this.calculateTotals();
    },

    removeItem(index) {
      this.invoiceForm.items.splice(index, 1);
      this.calculateTotals();
    },

    updateItem(index, field, value) {
      this.invoiceForm.items[index][field] = value;
      this.calculateTotals();
    },

    // ------------------------
    // CALCULATIONS (CORE LOGIC)
    // ------------------------
    calculateTotals() {
      let subTotal = 0;
      let discountTotal = 0;
      let taxTotal = 0;

      this.invoiceForm.items.forEach((item) => {
        let itemTotal = item.price * item.quantity;

        // Discount
        if (item.is_discount_enabled) {
          let discount =
            item.discount_type === "%"
              ? (itemTotal * item.discount) / 100
              : item.discount;

          itemTotal -= discount;
          discountTotal += discount;
        }

        // Tax
        if (item.is_tax_enabled) {
          let taxAmount = (itemTotal * item.tax) / 100;
          itemTotal += taxAmount;
          taxTotal += taxAmount;
        }

        item.total = itemTotal;
        subTotal += itemTotal;
      });

      // Global Taxes (invoice level)
      if (this.invoiceForm.is_tax_enabled) {
        this.invoiceForm.taxes.forEach((tax) => {
          tax.amount = (subTotal * tax.rate) / 100;
          taxTotal += tax.amount;
        });
      }

      this.invoiceForm.sub_total = subTotal;
      this.invoiceForm.discount_total = discountTotal;
      this.invoiceForm.tax_total = taxTotal;
      this.invoiceForm.grand_total = subTotal + taxTotal;
    },

    // ------------------------
    // API
    // ------------------------

     fetchInvoices() {
      api
        .get("/invoices")
        .then((response) => {
          this.invoices = response.data;
        })
        .catch((error) => {
          console.error("Error fetching customers:", error);
        });
    },

    async addInvoice() {
      try {
        const payload = this.formatPayload();
        const response = await api.post("/invoices", payload);

        this.invoices.push(response.data);
        this.resetForm();
      } catch (error) {
        console.error("Error adding invoice:", error);
      }
    },

    // ------------------------
    // FORMAT DATA FOR BACKEND
    // ------------------------
    formatPayload() {
      return {
        customer_id: this.invoiceForm.customer_id,
        invoice_number: this.invoiceForm.invoice_number,

        sub_total: this.invoiceForm.sub_total,
        discount_total: this.invoiceForm.discount_total,
        tax_total: this.invoiceForm.tax_total,
        grand_total: this.invoiceForm.grand_total,

        is_discount_enabled: this.invoiceForm.is_discount_enabled,
        is_tax_enabled: this.invoiceForm.is_tax_enabled,

        items: this.invoiceForm.items.map((item) => ({
          item_id: item.item_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          discount_type: item.discount_type,
          tax: item.tax,
          total: item.total,
        })),

        taxes: this.invoiceForm.taxes.map((tax) => ({
          tax_id: tax.id,
          amount: tax.amount,
        })),
      };
    },

    resetForm() {
      this.invoiceForm = {
        customer_id: null,
        invoice_number: "",
        items: [],
        taxes: [],
        is_discount_enabled: false,
        is_tax_enabled: false,
        sub_total: 0,
        discount_total: 0,
        tax_total: 0,
        grand_total: 0,
      };
    },
  },
});