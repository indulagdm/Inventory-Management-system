import { LocalInvoice, CloudInvoice } from "../models/invoice.model.js";
import { LocalItem, CloudItem } from "../models/item.model.js";
import {
  LocalItemHistory,
  CloudItemHistory,
} from "../models/item.history.model.js";
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
          as: "item.itemDetails",
        },
      },
    ]);

    if (!invoices) {
      throw new Error("Invoices are not exist.");
    }

    const invoicesWithStringId = invoices.map((invoice) => ({
      // ...invoice,
      // _id: invoice._id.toString(), // invoice id as string
      // item: invoice.item.map((it) => ({
      //   ...it,
      //   _id: it._id.toString(), // invoice item id as string
      //   itemID: it.itemID.toString()
      //     ? {
      //         ...it.itemID,
      //         _id: it.itemID._id.toString(), // product id as string
      //       }
      //     : null,
      // })),

      ...invoice,
      _id: invoice._id.toString(),

      item: Array.isArray(invoice.item)
        ? invoice.item.map((it) => ({
            ...it,
            _id: it._id?.toString(),

            itemID:
              it.itemID && typeof it.itemID === "object"
                ? {
                    ...it.itemID,
                    _id: it.itemID._id.toString(),
                  }
                : it.itemID?.toString() || null,
          }))
        : [], // fallback
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
      throw new Error("No invice found.");
    }

    const invoice = invoices[0];

    // const invoiceData = {
    //   invoiceNo: existInvoice.invoiceNo,
    //   customerName: existInvoice.customerName,
    //   customerAddress: existInvoice.customerAddress,
    //   customerPhone: existInvoice.customerPhone,
    //   total: existInvoice.total,
    //   createdAt: existInvoice.createdAt,
    //   updatedAt: existInvoice.updatedAt,
    //   item: Array.isArray(existInvoice.item)
    //     ? existInvoice.item.map((invoice) => {
    //         const invoiceObj = invoice.toObject();
    //         return {
    //           ...invoiceObj,
    //           _id: invoice._id.toString(),
    //           quantity: invoice.quantity,
    //           discount: invoice.discount,
    //           total_item: invoice.total_item,
    //           itemID: invoice.itemID
    //             ? {
    //                 ...invoice.itemID.toObject(),
    //                 _id: invoice.itemID._id.toString(),
    //               }
    //             : null,
    //         };
    //       })
    //     : existInvoice.item
    //     ? [
    //         {
    //           ...existInvoice.item.toObject(),
    //           _id: existInvoice.item._id.toString(),
    //           quantity: existInvoice.item.quantity || 0,
    //           discount: existInvoice.item.discount || 0,
    //           total_item: existInvoice.item.total_item || 0,
    //           itemID: existInvoice.item.itemID
    //             ? {
    //                 ...existInvoice.item.itemID.toObject(),
    //                 _id: existInvoice.item.itemID._id.toString(),
    //               }
    //             : null,
    //         },
    //       ]
    //     : [],
    // };

    const formattedInvoice = {
      _id: invoice._id.toString(),
      invoiceNo: invoice.invoiceNo,
      customerName: invoice.customerName,
      customerAddress: invoice.customerAddress,
      customerPhone: invoice.customerPhone,
      total: invoice.total,
      createdAt: invoice.createdAt,

      items: invoice.item.map((invItem) => {
        const itemInfo = invoice.itemDetails.find(
          (i) => i._id.toString() === invItem.itemID.toString()
        );

        return {
          itemID: invItem.itemID,
          itemName: itemInfo?.itemName,
          itemCode: itemInfo?.itemCode,
          sellingPrice: itemInfo?.sellingPrice,
          quantity: invItem.quantity,
          discount: invItem.discount,
          total_item: invItem.total_item,
        };
      }),
    };
    console.log("invoice", formattedInvoice);

    return {
      success: true,
      data: formattedInvoice,
      // data: {
      // ...invoice,
      // _id: invoice._id.toString(),
      // itemDetails: Array.isArray(invoice.itemDetails)
      //   ? invoice.itemDetails.map((item) => ({
      //       ...item,
      //       _id: item._id.toString(),
      //     }))
      //   : [],

      // },
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

const updateInvoice = async (invoiceID) => {};

export { createInvoice, getInvoiceById, getInvoices };
