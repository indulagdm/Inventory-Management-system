import mongoose from "mongoose";
import { atlasDB } from "../configs/atlas.config.js";
import { compassDB } from "../configs/compass.config.js";

const invoiceHistorySchema = new mongoose.Schema(
  {
    invoiceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invoices",
      required: [true, "Invoice ID is required."],
    },

    old_data: {
      type: Object,
      required: [true, "Invoice data is required."],
    },

    action: {
      type: String,
      enum: ["NEW","UPDATE", "DELETE"],
    },
  },
  { timestamps: true }
);

const LocalInvoiceHistory = compassDB.model(
  "invoiceHistories",
  invoiceHistorySchema
);
const CloudInvoiceHistory = atlasDB.model(
  "invoiceHistories",
  invoiceHistorySchema
);

export { LocalInvoiceHistory, CloudInvoiceHistory };
