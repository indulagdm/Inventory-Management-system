import mongoose from "mongoose";
import { atlasDB } from "../configs/atlas.config.js";
import { compassDB } from "../configs/compass.config.js";

const categoryHistorySchema = new mongoose.Schema(
  {
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "caterories",
      required: [true, "Category ID is required."],
    },

    old_data: {
      type: Object,
      required: [true, "Production data is required."],
    },

    action: {
      type: String,
      enum: ["NEW", "UPDATE", "DELETE"],
    },
  },
  { timestamps: true }
);

const LocalCategoryHistory = compassDB.model(
  "categoryhistories",
  categoryHistorySchema
);
const CloudCategoryHistory = atlasDB.model(
  "categoryHistories",
  categoryHistorySchema
);

export { LocalCategoryHistory, CloudCategoryHistory };
