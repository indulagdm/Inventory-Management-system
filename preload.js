const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openPopup: (route, options) => ipcRenderer.send("open-popup", route, options),
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
  //item
  createItem: (data) => ipcRenderer.invoke("create-item", data),
  getItems: () => ipcRenderer.invoke("get-items"),
  getItemByID: (itemID) => ipcRenderer.invoke("getItemByID", itemID),
  updateItem: (itemID, data) => ipcRenderer.invoke("updateItem", itemID, data),
  deleteItem: (itemID) => ipcRenderer.invoke("deleteItem", itemID),
  categoryByItems: () => ipcRenderer.invoke("items-by-category"),
  updateStock: (itemID, data) =>
    ipcRenderer.invoke("updateStock", itemID, data),
  noOfStock: () => ipcRenderer.invoke("number-of-stock"),
  noOfInStock: () => ipcRenderer.invoke("number-of-in-stock"),
  noOfOutStock: () => ipcRenderer.invoke("number-of-out-of-stock"),
  recentTransaction: () => ipcRenderer.invoke("recent-transactions"),
  recentTransactionAll: () => ipcRenderer.invoke("recent-transaction-all"),

  //category
  addCategory: (data) => ipcRenderer.invoke("add-category", data),
  removeCategory: (categoryID) =>
    ipcRenderer.invoke("remove-category", categoryID),
  getCategories: () => ipcRenderer.invoke("get-categories"),

  //invoice
  addInvoice: (data) => ipcRenderer.invoke("add-invoice", data),
  getInvoices: () => ipcRenderer.invoke("get-invoices"),
  getInvoiceByID: (invoiceID) =>
    ipcRenderer.invoke("get-invoice-ByID", invoiceID),
  updateInvoice: (invoiceID, formData) =>
    ipcRenderer.invoke("update-invoice", invoiceID, formData),
  deleteInvoice: (invoiceID) => ipcRenderer.invoke("delete-invoice", invoiceID),
  printInvoice: (invoiceID) =>
    ipcRenderer.invoke("get-print-invoice", invoiceID),
  downloadReport: (invoiceID, { htmlContent }) =>
    ipcRenderer.invoke("download-report", invoiceID, { htmlContent }),

  //activation
  productActivation: (data) => ipcRenderer.invoke("activation", data),
  getProduction: () => ipcRenderer.invoke("get-activation"),
});
