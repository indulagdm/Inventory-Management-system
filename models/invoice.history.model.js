import mongoose from "mongoose";
import { atlasDB } from "../configs/atlasDatabaseConfig.js";
import { compassDB } from "../configs/compassDatabaseConfig.js";

const invoceHistorySchema = new mongoose.Schema(
  {
    invoiceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invoices",
      required: [true, "Invoice ID is required."],
    },

    old_data: {
      type: Object,
      required: [true, "Invoice data is reuired."],
    },

    action: {
      type: String,
      enum: ["UPDATE", "DELETE"],
    },
  },
  { timestamps: true }
);

const LocalInvoiceHistory = compassDB.model(
  "inoviceHistories",
  invoceHistorySchema
);
const CloudInvoiceHistory = atlasDB.model(
  "invoiceHistories",
  invoceHistorySchema
);

export { LocalInvoiceHistory, CloudInvoiceHistory };
