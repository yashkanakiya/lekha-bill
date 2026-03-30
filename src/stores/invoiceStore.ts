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
      CustomerID: null,
      InvoiceNumber: "",
      items: [],
      taxes: [],

      isDiscountEnabled: false,
      isTaxEnabled: false,

      subTotal: 0,
      discountTotal: 0,
      taxTotal: 0,
      grandTotal: 0,
    },
  }),

  actions: {
    // ------------------------
    // ITEM MANAGEMENT
    // ------------------------
    addItem(item = null) {
      this.invoiceForm.items.push({
        itemId: item?.id || null,
        name: item?.name || "",
        price: item?.price || 0,
        quantity: 1,
        discount: 0,
        discountType: "fixed",
        tax: 0,
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
        if (item.isDiscountEnabled) {
          let discount =
            item.discountType === "%"
              ? (itemTotal * item.discount) / 100
              : item.discount;

          itemTotal -= discount;
          discountTotal += discount;
        }

        // Tax
        if (item.isTaxEnabled) {
          let taxAmount = (itemTotal * item.tax) / 100;
          itemTotal += taxAmount;
          taxTotal += taxAmount;
        }

        item.total = itemTotal;
        subTotal += itemTotal;
      });

      // Global Taxes (invoice level)
      if (this.invoiceForm.isTaxEnabled) {
        this.invoiceForm.taxes.forEach((tax) => {
          tax.amount = (subTotal * tax.rate) / 100;
          taxTotal += tax.amount;
        });
      }

      this.invoiceForm.subTotal = subTotal;
      this.invoiceForm.discountTotal = discountTotal;
      this.invoiceForm.taxTotal = taxTotal;
      this.invoiceForm.grandTotal = subTotal + taxTotal;
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
        invoice_number: this.invoiceForm.invoiceNumber,

        sub_total: this.invoiceForm.subTotal,
        discount_total: this.invoiceForm.discountTotal,
        tax_total: this.invoiceForm.taxTotal,
        grand_total: this.invoiceForm.grandTotal,

        is_discount_enabled: this.invoiceForm.isDiscountEnabled,
        is_tax_enabled: this.invoiceForm.isTaxEnabled,

        items: this.invoiceForm.items.map((item) => ({
          item_id: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          discount_type: item.discountType,
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
        customerId: null,
        invoiceNumber: "",
        items: [],
        taxes: [],
        isDiscountEnabled: false,
        isTaxEnabled: false,
        subTotal: 0,
        discountTotal: 0,
        taxTotal: 0,
        grandTotal: 0,
      };
    },
  },
});