import mongoose from "mongoose";

import { atlasDB } from "../configs/atlas.config.js";
import { compassDB } from "../configs/compass.config.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email should be uniqued."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isValid: {
      type: Boolean,
      default: false,
    },
    secretCode: {
      type: String,
    },
  },
  { timestamps: true }
);

const LocalUser = compassDB.model("users", userSchema);
const CloudUser = atlasDB.model("users", userSchema);

export { LocalUser, CloudUser };
