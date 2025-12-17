import { Schema } from "mongoose";
import { compassDB } from "../configs/compass.config.js";
import { atlasDB } from "../configs/atlas.config.js";

const InvoiceSchema = new Schema(
  {
    invoiceNo: {
      type: String,
      unique: [true],
    },
    item: [
      {
        itemID: {
          type: Schema.Types.ObjectId,
          ref: "items",
          required: [true],
        },
        quantity: {
          type: Number,
          required: [true],
          default: 1,
        },
        discount: {
          type: Number,
          default: 0,
        },
        total_item: {
          type: Number,
          default: 0,
        },
      },
    ],
    customerName: {
      type: String,
      required: [true],
    },
    customerAddress: {
      type: String,
      required: [true],
    },
    customerPhone: {
      type: String,
      required: [true],
    },
    total: {
      type: Number,
      default: 0,
    },
    synced: { type: Boolean, default: false },
  },

  { timestamps: true }
);

const LocalInvoice = compassDB.model("invoices", InvoiceSchema);
const CloudInvoice = atlasDB.model("invoices", InvoiceSchema);

export { LocalInvoice, CloudInvoice };
