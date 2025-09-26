//category

export const createCategory = async (data) => {
  try {
    const response = await window.electronAPI.addCategory(data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const createItem = async (data) => {
  try {
    const response = await window.electronAPI.createItem(data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getItems = async () => {
  try {
    const response = await window.electronAPI.getItems();
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCategories = async () => {
  try {
    const response = await window.electronAPI.getCategories();
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getItemByID = async (itemID) => {
  try {
    const response = await window.electronAPI.getItemByID(itemID);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateItem = async (itemID, data) => {
  try {
    const response = await window.electronAPI.updateItem(itemID, data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteItem = async (itemID) => {
  try {
    const response = await window.electronAPI.deleteItem(itemID);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateStock = async (itemID, data) => {
  try {
    const response = await window.electronAPI.updateStock(itemID, data);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
