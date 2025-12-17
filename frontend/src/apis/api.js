//category

const API = window.electronAPI;

export const categoryCreate = async (data) => {
  try {
    const response = await API.addCategory(data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const categoryDelete = async (categoryID) => {
  try {
    const response = await API.removeCategory(categoryID);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const categoryGets = async () => {
  try {
    const response = await API.getCategories();
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const itemCreate = async (data) => {
  try {
    const response = await API.createItem(data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const itemGets = async () => {
  try {
    const response = await API.getItems();
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const itemGetByID = async (itemID) => {
  try {
    const response = await API.getItemByID(itemID);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const itemUpdate = async (itemID, data) => {
  try {
    const response = await API.updateItem(itemID, data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const itemDelete = async (itemID) => {
  try {
    const response = await API.deleteItem(itemID);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const itemByCategory = async () => {
  try {
    const response = await API.categoryByItems();
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const stockUpdate = async (itemID, data) => {
  try {
    const response = await API.updateStock(itemID, data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const invoiceCreate = async (data) => {
  try {
    const response = await API.addInvoice(data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const invoiceGets = async () => {
  try {
    const response = await API.getInvoices();
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const invoicePrint = async (invoiceID) => {
  try {
    const response = await API.printInvoice(invoiceID);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const downloadReport = async (invoiceID, { htmlContent }) => {
  try {
    const response = await API.downloadReport(invoiceID, {
      htmlContent,
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const invoiceGetByID = async (invoiceID) => {
  try {
    const response = await API.getInvoiceByID(invoiceID);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getNumberOfStock = async () => {
  try {
    const response = await API.noOfStock();
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getNumberOfInStock = async () => {
  try {
    const response = await API.noOfInStock();
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getNumberOfOutOfStock = async () => {
  try {
    const response = await API.noOfOutStock();
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getRecentTransaction = async () => {
  try {
    const response = await API.recentTransaction();
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getRecentTransactionAll = async () => {
  try {
    const response = await API.recentTransactionAll();
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

//activation
export const createActivation = async (data) => {
  try {
    const response = await productActivation(data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getActivation = async () => {
  try {
    const response = await getProduction();
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
