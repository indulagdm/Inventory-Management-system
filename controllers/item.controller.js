import { LocalItem, CloudItem } from "../models/item.model.js";
import {
  LocalItemHistory,
  CloudItemHistory,
} from "../models/item.history.model.js";
import mongoose from "mongoose";

const createItem = async (formData) => {
  try {
    const {
      itemCode,
      itemName,
      categoryID,
      description,
      unitPrice,
      sellingPrice,
      discount,
      stock,
    } = formData;

    let convertedCategoryID = categoryID;

    if (!itemCode || !itemName) {
      throw new Error("Item code and item name is mandatory.");
    }

    // Handle Mongoose ObjectId
    if (
      typeof convertedCategoryID === "object" &&
      convertedCategoryID.toHexString
    ) {
      convertedCategoryID = convertedCategoryID.toHexString();
    }
    // Handle Buffer
    else if (
      typeof convertedCategoryID === "object" &&
      convertedCategoryID.buffer
    ) {
      convertedCategoryID = new mongoose.Types.ObjectId(
        convertedCategoryID.buffer,
      ).toHexString();
    }
    // Handle plain object with CategoryID property
    else if (
      typeof convertedCategoryID === "object" &&
      convertedCategoryID.categoryID
    ) {
      convertedCategoryID = convertedCategoryID.categoryID; // Assign the string value
    }
    // Ensure it's a string
    convertedCategoryID = String(convertedCategoryID);
    if (!mongoose.isValidObjectId(convertedCategoryID)) {
      throw new Error(
        "Invalid Category ID: " + JSON.stringify(convertedCategoryID),
      );
    }

    if (!convertedCategoryID) {
      // Check convertedCategoryID instead of CategoryID
      throw new Error("CategoryID is not found.");
    }

    const existItem = await LocalItem.findOne({
      itemCode: itemCode,
      itemName: itemName,
      categoryID: convertedCategoryID,
    });

    if (existItem) {
      throw new Error("Item already exist.");
    }

    let s_status;

    if (stock > 10) s_status = "in-stock";
    else if (stock <= 10) s_status = "low-stock";
    else s_status = "out-of-stock";

    const newItem = new LocalItem({
      itemCode: itemCode,
      itemName: itemName,
      categoryID: categoryID,
      description: description,
      unitPrice: unitPrice,
      sellingPrice: sellingPrice,
      discount: discount,
      stock: stock,
      stockStatus: s_status,
    });

    if (!newItem) {
      throw new Error("Item creation failed.");
    }

    await newItem.save();

    const newItemHistory = new LocalItemHistory({
      itemID: newItem._id,
      old_data: newItem,
      action: "NEW",
    });

    if (!newItemHistory) {
      throw new Error("Failed to save item history.");
    }

    await newItemHistory.save();

    return { success: true, message: "Item added.", data: newItem.toObject() };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

const getItems = async () => {
  try {
    let items = await LocalItem.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryID",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
    ]);

    items = items.map((item) => ({
      ...item,
      _id: item._id.toString(),

      // ✅ SAFE conversion
      categoryID: item.categoryID ? item.categoryID.toString() : null,

      // ✅ SAFE mapping
      categoryDetails: Array.isArray(item.categoryDetails)
        ? item.categoryDetails.map((cat) => ({
            ...cat,
            _id: cat._id.toString(),
          }))
        : [],
    }));

    if (!items) {
      throw new Error("No Item found.");
    }

    return { data: items, success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

const getItemById = async (item_id) => {
  try {
    const items = await LocalItem.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(item_id),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryID",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
    ]);

    if (!items.length) {
      throw new Error("No item found.");
    }

    const item = items[0];

    return {
      success: true,
      data: {
        ...item,
        _id: item._id.toString(),
        categoryID: item.categoryID?.toString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

const updateItem = async (itemID, data) => {
  try {
    let convertedItemID = itemID;
    const {
      itemCode,
      itemName,
      categoryID,
      description,
      unitPrice,
      sellingPrice,
      discount,
      stock,
    } = data;

    let convertedCategoryID = categoryID;

    const existItem = await LocalItem.findById(convertedItemID);

    if (!existItem) {
      throw new Error("This item is not found.");
    }

    const updateItem = await LocalItem.findByIdAndUpdate(
      { _id: convertedItemID },
      {
        itemCode: itemCode,
        itemName: itemName,
        categoryID: convertedCategoryID,
        description: description,
        unitPrice: unitPrice,
        sellingPrice: sellingPrice,
        discount: discount,
        stock: stock,
      },
      { new: true },
    );

    if (!updateItem) {
      throw new Error("Item update failed.");
    }

    if (existItem) {
      const addItemHistory = new LocalItemHistory({
        itemID: convertedItemID,
        old_data: existItem,
        action: "UPDATE",
      });

      if (!addItemHistory) {
        throw new Error("Failed to save item history.");
      }

      await addItemHistory.save();

      return {
        data: updateItem.toObject(),
        success: true,
        message: "Item updated.",
      };
    } else {
      return { success: false, message: "Item not found." };
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

const updateStock = async (itemID, data) => {
  try {
    let convertedItemID = itemID;

    // Handle Mongoose ObjectId
    if (typeof convertedItemID === "object" && convertedItemID.toHexString) {
      convertedItemID = convertedItemID.toHexString();
    }
    // Handle Buffer
    else if (typeof convertedItemID === "object" && convertedItemID.buffer) {
      convertedItemID = new mongoose.Types.ObjectId(
        convertedItemID.buffer,
      ).toHexString();
    }
    // Handle plain object with itemID property
    else if (typeof convertedItemID === "object" && convertedItemID.itemID) {
      convertedItemID = convertedItemID.itemID; // Assign the string value
    }
    // Ensure it's a string
    convertedItemID = String(convertedItemID);

    if (!mongoose.isValidObjectId(convertedItemID)) {
      throw new Error("Invalid Item ID: " + JSON.stringify(convertedItemID));
    }

    if (!convertedItemID) {
      // Check convertedItemID instead of itemID
      throw new Error("ItemID is not found.");
    }
    const { stock } = data;

    const existItem = await LocalItem.findById(convertedItemID);
    if (existItem) {
      let updateStock = existItem.stock + stock;

      const updateItem = await LocalItem.findByIdAndUpdate(
        { _id: convertedItemID },
        {
          stock: updateStock,
          synced: false,
        },
        { new: true },
      );

      if (!updateItem) {
        throw new Error("Item update failed.");
      }

      const addItemHistory = new LocalItemHistory({
        itemID: convertedItemID,
        old_data: updateItem,
        action: "STOCK UPDATE",
      });

      if (!addItemHistory) {
        throw new Error("Failed to save item history.");
      }

      await addItemHistory.save();

      return {
        data: updateItem.toObject(),
        success: true,
        message: "Stock updated.",
      };
    } else {
      return { success: false, message: "Item not found." };
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

const deleteItem = async (itemID) => {
  try {
    let convertedItemID = itemID;

    // Handle Mongoose ObjectId
    if (typeof convertedItemID === "object" && convertedItemID.toHexString) {
      convertedItemID = convertedItemID.toHexString();
    }
    // Handle Buffer
    else if (typeof convertedItemID === "object" && convertedItemID.buffer) {
      convertedItemID = new mongoose.Types.ObjectId(
        convertedItemID.buffer,
      ).toHexString();
    }
    // Handle plain object with itemID property
    else if (typeof convertedItemID === "object" && convertedItemID.itemID) {
      convertedItemID = convertedItemID.itemID; // Assign the string value
    }
    // Ensure it's a string
    convertedItemID = String(convertedItemID);
    if (!mongoose.isValidObjectId(convertedItemID)) {
      throw new Error("Invalid Item ID: " + JSON.stringify(convertedItemID));
    }

    if (!convertedItemID) {
      // Check convertedItemID instead of itemID
      throw new Error("ItemID is not found.");
    }

    const existItem = await LocalItem.findById(convertedItemID);

    if (!existItem) {
      throw new Error("Item not found.");
    }

    const deleteItem = await LocalItem.findOneAndDelete({
      _id: convertedItemID,
    });

    if (!deleteItem) {
      throw new Error("Item delete failed.");
    }

    const addItemHistory = new LocalItemHistory({
      itemID: existItem._id,
      old_data: existItem,
      action: "DELETE",
    });

    if (!addItemHistory) {
      throw new Error("Failed to save item history.");
    }

    await addItemHistory.save();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

const categoryByItems = async () => {
  try {
    const items = await LocalItem.aggregate([
      {
        $addFields: {
          categoryID: {
            $cond: {
              if: { $eq: [{ $type: "$categoryID" }, "string"] },
              then: { $toObjectId: "$categoryID" },
              else: "$categoryID",
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryID",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $addFields: {
          _id: { $toString: "$_id" },
          categoryID: { $toString: "$categoryID" },
          categoryDetails: {
            $map: {
              input: "$categoryDetails",
              as: "c",
              in: {
                _id: { $toString: "$$c._id" },
                categoryName: "$$c.categoryName",
                synced: "$$c.synced",
                createdAt: "$$c.createdAt",
                updatedAt: "$$c.updatedAt",
              },
            },
          },
        },
      },
    ]);

    const cleanData = JSON.parse(JSON.stringify(items));

    return {
      success: true,
      data: cleanData,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export {
  createItem,
  getItems,
  getItemById,
  updateItem,
  updateStock,
  deleteItem,
  categoryByItems,
};
