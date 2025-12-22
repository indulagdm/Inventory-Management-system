import mongoose from "mongoose";
import { atlasDB } from "../configs/atlas.config.js";
import { compassDB } from "../configs/compass.config.js";

const itemHistorySchema = new mongoose.Schema(
  {
    itemID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "items",
      required: [true, "Item ID is required."],
    },

    old_data: {
      type: Object,
      required: [true, "Item data is required."],
    },
    action: {
      type: String,
      enum: [
        "NEW",
        "UPDATE",
        "DELETE",
        "STOCK UPDATE",
        "STOCK UPDATE ON INVOICE",
      ],
    },
  },
  { timestamp: true }
);

const LocalItemHistory = compassDB.model("itemHistories", itemHistorySchema);
const CloudItemHistory = atlasDB.model("itemHistories", itemHistorySchema);

export { LocalItemHistory, CloudItemHistory };
