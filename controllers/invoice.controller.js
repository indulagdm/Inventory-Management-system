import { LocalInvoice, CloudInvoice } from "../models/invoice.model.js";
import { LocalItem, CloudItem } from "../models/item.model.js";
import {
  LocalItemHistory,
  CloudItemHistory,
} from "../models/item.history.model.js";
import {
  LocalInvoiceHistory,
  CloudInvoiceHistory,
} from "../models/invoice.history.model.js";

import { generateID } from "../utils/generateID.js";
import mongoose from "mongoose";

const createInvoice = async (data) => {
  try {
    const { invoiceNo, customerName, customerAddress, customerPhone, item } =
      data;

    // Validate required fields
    if (!customerName) {
      throw new Error("Customer name is required.");
    }
    if (!customerAddress) {
      throw new Error("Customer address is required.");
    }
    if (!customerPhone) {
      throw new Error("Customer mobile number/resident number is required.");
    }
    if (!Array.isArray(item) || item.length === 0) {
      throw new Error("At least one item is required.");
    }

    // Validate and convert items
    const convertedItems = item.map((itemObj) => {
      let { itemID, quantity, discount } = itemObj;

      // Validate itemID
      if (!itemID) {
        throw new Error("Item ID is required for all items.");
      }

      // Handle Mongoose ObjectId
      if (typeof itemID === "object" && itemID.toHexString) {
        itemID = itemID.toHexString();
      } else if (typeof itemID === "object" && itemID.buffer) {
        itemID = new mongoose.Types.ObjectId(itemID.buffer).toHexString();
      } else if (typeof itemID === "object" && itemID.itemID) {
        itemID = itemID.itemID;
      }
      itemID = String(itemID);

      if (!mongoose.isValidObjectId(itemID)) {
        throw new Error(`Invalid Item ID: ${JSON.stringify(itemID)}`);
      }

      // Validate quantity
      if (quantity === undefined || quantity === "" || isNaN(quantity)) {
        throw new Error(`Invalid quantity for item ${itemID}: ${quantity}`);
      }
      quantity = Number(quantity);
      if (quantity < 1) {
        throw new Error(`Quantity for item ${itemID} must be at least 1`);
      }

      // Validate discount
      discount = Number(discount) || 0;
      if (discount < 0) {
        throw new Error(`Discount for item ${itemID} cannot be negative`);
      }

      return { itemID, quantity, discount };
    });

    // Generate invoice ID
    let genInvoiceID = await generateID("Inv");
    const existInvoiceID = await LocalInvoice.findOne({
      invoiceNo: genInvoiceID,
    });
    if (existInvoiceID) {
      genInvoiceID = await generateID("Inv");
    }

    // Find or create invoice
    let invoices = await LocalInvoice.findOne({
      invoiceNo: invoiceNo || genInvoiceID,
    }).populate("itemID");
    if (!invoices) {
      invoices = new LocalInvoice({
        invoiceNo: invoiceNo || genInvoiceID,
        customerName,
        customerAddress,
        customerPhone,
        item: [],
      });
    }

    // Update items
    for (const newItem of convertedItems) {
      const existItem = invoices.item.find(
        (item) => item.itemID.toString() === newItem.itemID
      );
      if (existItem) {
        existItem.quantity += newItem.quantity;
        existItem.discount = newItem.discount; // Update discount if needed
      } else {
        invoices.item.push({
          itemID: newItem.itemID,
          quantity: newItem.quantity,
          discount: newItem.discount,
        });
      }
    }

    // Calculate total
    let total = 0;
    for (const item of invoices.item) {
      const itemExist = await LocalItem.findOne({ _id: item.itemID });
      if (itemExist) {
        if (itemExist.stock <= item.quantity) {
          throw new Error("Quantity is more than inventory stock.");
        }
        const itemTotal = item.quantity * itemExist.sellingPrice;
        item.total_item = itemTotal;
        total += itemTotal;

        itemExist.stock -= item.quantity;

        if (itemExist.stock <= 10) itemExist.stockStatus == "low-stock";
        else if (itemExist.stock <= 0) itemExist.stockStatus == "out-of-stock";

        itemExist.save();

        const addItemForHistory = new LocalItemHistory({
          itemID: item.itemID,
          old_data: itemExist,
          action: "UPDATE",
        });

        await addItemForHistory.save();
      } else {
        throw new Error(`Item with ID ${item.itemID} not found`);
      }
    }

    invoices.total = total;

    // Save invoice
    await invoices.save();

    // Convert Mongoose document to plain object
    const invoicePlain = invoices.toObject();
    // Convert ObjectId fields to strings
    invoicePlain._id = invoicePlain._id.toString();
    invoicePlain.item = invoicePlain.item.map((item) => ({
      ...item,
      itemID: item.itemID.toString(),
    }));

    return { success: true, data: invoicePlain };
  } catch (error) {
    console.error("Error in add-invoice:", error);
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

const getInvoices = async () => {
  try {
    const invoices = await LocalInvoice.aggregate([
      {
        $lookup: {
          from: "items",
          localField: "item.itemID",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
    ]);

    if (!invoices) {
      throw new Error("Invoices are not exist.");
    }

    const invoicesWithStringId = invoices.map((invoice) => ({
      ...invoice,
      _id: invoice._id.toString(),

      item: Array.isArray(invoice.item)
        ? invoice.item.map((it) => ({
            ...it,
            _id: it._id?.toString?.() || undefined,

            itemID: it.itemID ? it.itemID.toString() : null,
          }))
        : [],
    }));

    return { success: true, data: invoicesWithStringId };
  } catch (error) {
    console.error("Error in get invoice:", error);
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

const getInvoiceById = async (invoiceID) => {
  try {
    const invoices = await LocalInvoice.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(invoiceID),
        },
      },
      {
        $lookup: {
          from: "items",
          localField: "item.itemID",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
    ]);

    if (!invoices.length) {
      throw new Error("No invoice found.");
    }

    const invoice = invoices[0];

    const formattedInvoice = {
      ...invoice,
      _id: invoice._id.toString(),

      item: Array.isArray(invoice.item)
        ? invoice.item.map((it) => ({
            ...it,
            _id: it._id.toString(),
            itemID: it.itemID.toString(),
          }))
        : [],

      itemDetails: Array.isArray(invoice.itemDetails)
        ? invoice.itemDetails.map((item) => ({
            ...item,
            _id: item._id.toString(),
          }))
        : [],
    };

    return {
      success: true,
      data: formattedInvoice,
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

const updateInvoice = async (invoiceID, formData) => {
  try {
    const {
      invoiceNo,
      customerName,
      customerAddress,
      customerPhone,
      items,
      total,
    } = formData;

    if (!mongoose.Types.ObjectId.isValid(invoiceID)) {
      throw new Error("Invalid invoice id.");
    }

    // Validate required fields
    if (!customerName || !customerAddress || !customerPhone) {
      throw new Error("Customer details are required.");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("At least one item is required.");
    }

    const updatedQuantity = {};
    // Validate each item
    for (const item of items) {
      if (!item.itemID || !mongoose.Types.ObjectId.isValid(item.itemID)) {
        throw new Error("Invalid itemID in items list.");
      }
      if (!item.quantity || item.quantity < 1) {
        throw new Error("Quantity must be at least 1.");
      }

      let itemOnItem = await LocalItem.findOne({ _id: item.itemID });

      updatedQuantity[itemOnItem._id.toString()] = item.quantity;

      if (item.quantity >= itemOnItem.stock) {
        throw new Error("Quantity is more that stock. Please update stock.");
      }
    }

    const existInvoice = await LocalInvoice.findOne({ _id: invoiceID });

    if (!existInvoice) {
      throw new Error("No invoice found.");
    }

    const itemIDs = items.map((i) => new mongoose.Types.ObjectId(i.itemID));

    const existInvoiceItemIDs = existInvoice.item.map(
      (i) => new mongoose.Types.ObjectId(i.itemID)
    );

    const invoiceDocs = await LocalInvoice.find({
      _id: invoiceID,
      item: {
        $elemMatch: {
          itemID: { $in: existInvoiceItemIDs },
        },
      },
    });

    const existInvoiceItemQuantity = {};
    const existItemCount = {};
    const priceMap = {};

    const itemDocs = await LocalItem.find({
      _id: { $in: existInvoiceItemIDs },
    });

    invoiceDocs.forEach((invoice) => {
      invoice.item.forEach((it) => {
        existInvoiceItemQuantity[it.itemID.toString()] = it.quantity;
      });
    });

    let updateStock = 0;

    // itemDocs.forEach((doc) => {
    for (const doc of itemDocs) {
      existItemCount[(doc._id, toString())] = doc.stock;
      const countOnItemStock = existItemCount[doc._id.toString()];
      const countOnInvoiceItemQuantity =
        existInvoiceItemQuantity[doc._id.toString()];

      console.log("countOnInvoiceItemQuantity", countOnInvoiceItemQuantity);

      const updatedInvoiceQuantity = updatedQuantity[doc._id.toString()];

      console.log("updatedInvoiceQuantity", updatedInvoiceQuantity);

      updateStock = countOnInvoiceItemQuantity - updatedInvoiceQuantity;

      console.log("updateStock", updateStock);

      let item = await LocalItem.findOne({ _id: doc._id });

      if (updateStock > 0 && updateStock != 0) {
        item.stock += updateStock;
      }
      if (updateStock < 0 && updateStock != 0) {
        item.stock -= updateStock;
      }
      if (updateStock == 0) {
      }

      await item.save();

      priceMap[doc._id.toString()] = doc.sellingPrice || 0;
    }
    // });

    // Recalculate total_item for each and grand total
    let calculatedTotal = 0;
    const updatedItems = items.map((item) => {
      const price = priceMap[item.itemID] || 0;
      const total_item = item.quantity * price - (item.discount || 0);
      calculatedTotal += total_item;

      return {
        itemID: new mongoose.Types.ObjectId(item.itemID),
        quantity: Number(item.quantity),
        discount: Number(item.discount || 0),
        total_item: total_item,
      };
    });
    const finalTotal = total ? Number(total) : calculatedTotal;

    const updatedInvoice = await LocalInvoice.findOneAndUpdate(
      {
        _id: invoiceID,
      },
      {
        invoiceNo,
        customerName,
        customerAddress,
        customerPhone,
        item: updatedItems,
        total: finalTotal,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedInvoice) {
      throw new Error("Invoice not found.");
    }

    return {
      success: true,
      data: updatedInvoice,
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

const deleteInvoice = async (invoiceID) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(invoiceID)) {
      throw new Error("Invalid invoice ID.");
    }

    const deleted = await LocalInvoice.findOneAndDelete({ _id: invoiceID });

    if (!deleted) {
      throw new Error("Invoice not found.");
    }

    return {
      success: true,
      message: "Invoice deleted successfully",
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
  createInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoice,
  deleteInvoice,
};
