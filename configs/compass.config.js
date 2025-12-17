import mongoose from "mongoose";
import { MONGO_COMPASS_URL } from "../utils/variable.js";

const compassDB = mongoose.createConnection(MONGO_COMPASS_URL);

compassDB.on("connected", () =>
  console.log(`Compass Connected: ${compassDB.host}`)
);
compassDB.on("error", (err) => console.error("Compass DB Error:", err));

const disconnectCompassDatabase = async () => {
  try {
    await compassDB.close();
    console.log("Compass Disconnected");
    compassDB = null;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export { disconnectCompassDatabase, compassDB };
