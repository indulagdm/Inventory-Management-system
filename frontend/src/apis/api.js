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
