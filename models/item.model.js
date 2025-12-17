import mongoose from "mongoose";
import { compassDB } from "../configs/compass.config.js";
import { atlasDB } from "../configs/atlas.config.js";
const ItemSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      required: [true],
      unique: [true],
    },
    itemName: {
      type: String,
      required: [true],
    },
    categoryID: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: [true],
    },
    description: {
      type: String,
      required: [true],
    },
    unitPrice: {
      type: Number,
    },
    sellingPrice: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["show", "hide"],
      default: "show",
    },
    stockStatus: {
      type: String,
      enum: ["in-stock", "low-stock", "out-of-stock"],
    },
    synced: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const LocalItem = compassDB.model("items", ItemSchema);
const CloudItem = atlasDB.model("items", ItemSchema);

export { LocalItem, CloudItem };
