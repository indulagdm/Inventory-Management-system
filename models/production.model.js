import mongoose from "mongoose";
import { compassDB } from "../configs/compass.config.js";
import { atlasDB } from "../configs/atlas.config.js";

const productionSchema = new mongoose.Schema(
  {
    productionKey: {
      type: String,
      required: [true, "Production key is required."],
      unique: [true, "Production must be unique."],
    },
    status: {
      type: String,
      enum: ["registed", "temperory"],
      default: "temporary",
    },
    machineId: {
      type: String,
      required: [true, "Machine id is mandotary."],
    },
    synced: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const LocalProduction = compassDB.model("production", productionSchema);
const CloudProduction = atlasDB.model("production", productionSchema);

export { LocalProduction, CloudProduction };
