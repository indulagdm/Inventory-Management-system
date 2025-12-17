import pkg from "node-machine-id";
const { machineIdSync } = pkg;
import { LocalProduction, CloudProduction } from "../models/production.model.js";
import {
  saveKey,
  getKey,
  encryption,
  decryption,
  deleteKey,
} from "../security/advanceSecurity.js";
import { dirname } from "../utils/dirname.js";

import fs from "fs";
import path from "path";
const __dirname = dirname(import.meta.url);

const LICENSE_FILE = path.join(__dirname, "./", "resources", "license.enc");

const machineId = machineIdSync({ original: true });

const createProduction = async (data) => {
  try {
    const { productionKey } = data;

    if (!productionKey) {
      throw new Error("Production is required.");
    }

    const existProduction = await LocalProduction.findOne({
      machineID: machineId,
    });

    if (existProduction) {
      throw new Error("This device is already registed.");
    }

    const encryptedData = fs.readFileSync(LICENSE_FILE, "utf8");

    const encryptProductionkey = encryption(productionKey);

    if (encryptedData === encryptProductionkey) {
      const newProduction = new LocalProduction({
        productionKey: encryptProductionkey,
        status: "registed",
        machineId: machineId,
      });

      if (!newProduction) {
        throw new Error("production is not saved.");
      }

      await saveKey(encryptProductionkey);

      await newProduction.save();
    } else {
      throw new Error("Production key is wrong, try again.");
    }
  } catch (error) {
    return {
      success: false,
      error: { message: error.message },
    };
  }
};

const getProductionDetails = async () => {
  try {
    const getInstalledKey = await getKey();

    const encryptedData = fs.readFileSync(LICENSE_FILE, "utf8");

    const existDetails = await LocalProduction.findOne({
      machineId: machineId,
      productionKey: getInstalledKey,
    });

    if (!existDetails) {
      throw new Error("Production key not set for this device.");
    }

    const decryptedDatabaseKey = decryption(existDetails.productionKey);
    const installedKey = decryption(getInstalledKey);

    if (encryptedData === getInstalledKey) {
      if (existDetails && getInstalledKey) {
        return { success: true, message: "App is activated" };
      } else {
        throw new Error("Device not activated.");
      }
    }

    if (getInstalledKey === null || !getInstalledKey) {
      throw new Error("Production details not found.");
    }

    if (decryptedDatabaseKey != installedKey) {
      throw new Error("installed key not matched.");
    }

    return { success: true, existDetails };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export { createProduction, getProductionDetails };
