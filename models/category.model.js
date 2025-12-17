import { Schema } from "mongoose";
import { compassDB } from "../configs/compass.config.js";
import { atlasDB } from "../configs/atlas.config.js";
const CategorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: [true],
      unique: [true, "That category already taken."],
    },
    synced: { type: Boolean, default: false },
  }, 
  { timestamps: true }
);

const LocalCategory = compassDB.model("categories", CategorySchema);
const CloudCategory = atlasDB.model("categories", CategorySchema);
export { LocalCategory, CloudCategory };
