import mongoose from "mongoose";
import { MONGO_ATLAS_URL } from "../utils/variable.js";

const atlasDB = mongoose.createConnection(MONGO_ATLAS_URL);

atlasDB.on("connected", () => {
  console.log("Atlas Connected:", atlasDB.host);
});

atlasDB.on("error", (err) => {
  console.error("Atlas Connection Error:", err.message);
});

const disconnectAtlasDatabase = async () => {
  try {
    await atlasDB.close();
    console.log("Atlas Disconnected");
    atlasDB = null;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export { disconnectAtlasDatabase, atlasDB };
