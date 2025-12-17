import { LocalCategory, CloudCategory } from "../models/category.model.js";
import { LocalItem, CloudItem } from "../models/item.model.js";
import {
  LocalCategoryHistory,
  CloudCategoryHistory,
} from "../models/category.history.model.js";

const createCategory = async (formData) => {
  try {
    const { categoryName } = formData;

    if (!categoryName) {
      throw new Error("Please enter category.");
    }

    const existCategory = await LocalCategory.findOne({
      categoryName: categoryName,
    });
    if (existCategory) {
      throw new Error("Category already added.");
    }

    const newCategory = new LocalCategory({
      categoryName: categoryName,
    });

    if (!newCategory) {
      throw new Error("Failed to add category.");
    }

    await newCategory.save();

    return { success: true, message: "New category added." };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

const deleteCategory = async (category_id) => {
  try {
    const existCategory = await LocalCategory.findOne({
      _id: category_id,
    });

    if (!existCategory) {
      throw new Error("Category not found.");
    }

    const items = await LocalItem.findOne({ categoryID: existCategory._id });

    if (Array.isArray(items) && items.length > 0) {
      const updateItem = await LocalItem.findOneAndUpdate(
        { categoryID: existCategory._id },
        { categoryID: null, synced: false },
        { new: true }
      );

      if (!updateItem) {
        throw new Error("Item's category delete failed.");
      }
    } else {
    }

    const deleteCategory = await LocalCategory.findByIdAndDelete(category_id);

    if (!deleteCategory) {
      throw new Error("Fail to delete category.");
    }

    const addingHistory = new LocalCategoryHistory({
      categoryID: category_id,
      old_data: existCategory,
      action: "DELETE",
    });

    if (!addingHistory) {
      throw new Error("Failed to save history.");
    }

    await addingHistory.save();

    return { success: true, message: "Category deleted." };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

const getCategories = async () => {
  try {
    const category = await LocalCategory.find().lean();

    if (!category) {
      throw new Error("No category found.");
    }

    const categoriesWithStringId = category.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
    }));

    return { success: true, data: categoriesWithStringId };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export { createCategory, deleteCategory, getCategories };
