import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  shell,
  Menu,
  screen,
} from "electron";
import crypto from "crypto";
import puppeteer from "puppeteer";
import mime from "mime-types";
import { promises as fs } from "fs";
import sanitize from "sanitize-filename";
import path from "path";
import { dirname } from "./utils/dirname.js";
import { startAutoSync } from "./services/autoSyncService.js";
const __dirname = dirname(import.meta.url);

const isPackaged = app.isPackaged;
const assetsPath = isPackaged
  ? path.join(process.resourcesPath, "assets") // Built app
  : path.join(__dirname, "assets"); // Development

import {
  createCategory,
  deleteCategory,
  getCategories,
} from "./controllers/category.controller.js";

import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  updateStock,
  deleteItem,
  categoryByItems,
} from "./controllers/item.controller.js";

import { generateReport } from "./utils/generateReportUtils.js";

import { downloadReport } from "./utils/downloadReportUtils.js";

import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "./controllers/invoice.controller.js";

import {
  compassDB,
  disconnectCompassDatabase,
} from "./configs/compass.config.js";

import {
  LocalItemHistory,
  CloudItemHistory,
} from "./models/item.history.model.js";
import { LocalItem, CloudItem } from "./models/item.model.js";

import {
  createProduction,
  getProductionDetails,
} from "./controllers/production.controller.js";
import { atlasDB, disconnectAtlasDatabase } from "./configs/atlas.config.js";

// if (!isPackaged) {
//   try {
//     electronReload(__dirname, {
//       electron: join(__dirname, "node_modules", ".bin", "electron"),
//       // Prevent reloading on changes in node_modules, .git, and build output
//       ignored: [
//         /node_modules/,
//         /\.git/,
//         /[\/\\]\./, // dotfiles like .env or .vscode
//         /frontend\/dist/, // optional: if you're using Vite or Webpack builds
//       ],
//     });
//     console.log("electron-reload is enabled in development.");
//   } catch (err) {
//     console.warn("electron-reload not found. Safe to ignore in production.");
//   }
// }

//activation
ipcMain.handle("activation", async (event, data) => {
  try {
    const response = await createProduction(data);
    return response;
  } catch (error) {
    throw error;
  }
});

const isActivated = async (browserWindow) => {
  try {
    const getActivation = await getProductionKey();

    const getActivationKey = await getKey();
    if (getActivation && getActivationKey) {
      browserWindow.webContents.send("activation-status", {
        success: true,
        message: "Activation successful! Restart app to continue.",
      });
    } else {
      browserWindow.webContents.send("activation-status", {
        success: false,
        message: "No valid activation found for this device",
      });
    }
  } catch (error) {
    browserWindow.webContents.send("activation-status", {
      success: false,
      message: "Error checking activation: " + error.message,
    });
    console.error("Activation failed.");
  }
};

ipcMain.handle("get-activation", async (event) => {
  try {
    const response = await getProductionDetails();
    return response;
  } catch (error) {
    throw error;
  }
});

//category controller
ipcMain.handle("add-category", async (event, formData) => {
  try {
    const category = await createCategory(formData);
    return category;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("remove-category", async (event, categoryID) => {
  try {
    const category = await deleteCategory(categoryID);
    return category;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("get-categories", async (event) => {
  try {
    const category = await getCategories();
    return category;
  } catch (error) {
    throw error;
  }
});

//item controller
ipcMain.handle("create-item", async (event, data) => {
  try {
    const item = await createItem(data);
    return item;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("get-items", async (event) => {
  try {
    const items = await getItems();
    return items;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("getItemByID", async (event, itemID) => {
  try {
    const item = await getItemById(itemID);
    return item;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("updateItem", async (event, itemID, data) => {
  try {
    const item = await updateItem(itemID, data);
    return item;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("updateStock", async (event, itemID, data) => {
  try {
    const item = await updateStock(itemID, data);
    return item;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("deleteItem", async (event, itemID) => {
  try {
    const item = await deleteItem(itemID);
    return item;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("items-by-category", async (event) => {
  try {
    const response = await categoryByItems();
    return response;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("add-invoice", async (event, data) => {
  try {
    const invoice = await createInvoice(data);
    return invoice;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("get-invoices", async (event) => {
  try {
    const invoice = await getInvoices();
    return invoice;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("get-invoice-ByID", async (event, invoiceID) => {
  try {
    const invoice = await getInvoiceById(invoiceID);
    return invoice;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("update-invoice", async (event, invoiceID, formData) => {
  try {
    const invoice = await updateInvoice(invoiceID, formData);
    return invoice;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("delete-invoice", async (event, invoiceID) => {
  try {
    const invoice = await deleteInvoice(invoiceID);
    return invoice;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("get-print-invoice", async (event, invoiceID) => {
  try {
    const html = await generateReport({
      invoiceID: invoiceID,
    });
    return { status: 200, html };
  } catch (error) {
    console.error("Error in print-invoice:", error);
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
});

ipcMain.handle("number-of-stock", async (event) => {
  try {
    const items = await LocalItem.countDocuments();
    return { success: true, data: items };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
});

ipcMain.handle("number-of-in-stock", async (event) => {
  try {
    const items = await LocalItem.countDocuments({ stockStatus: "in-stock" });
    return { success: true, data: items };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
});

ipcMain.handle("number-of-out-of-stock", async (event) => {
  try {
    const items = await LocalItem.countDocuments({
      stockStatus: "out-of-stock",
    });
    return { success: true, data: items };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
});

ipcMain.handle("recent-transactions", async (event) => {
  try {
    const items = await LocalItemHistory.find();

    if (!items) {
      throw new Error("Item are not exist.");
    }

    const itemHistoryWithStringId = items.map((item) => ({
      ...item.toObject(),
      _id: item._id.toString(),
    }));

    return { success: true, data: itemHistoryWithStringId };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
});

ipcMain.handle("recent-transaction-all", async (event) => {
  try {
    const items = await LocalItemHistory.find();
    if (!items) {
      throw new Error("Item are not exist.");
    }

    const itemHistoryWithStringId = items.map((item) => ({
      ...item.toObject(),
      _id: item._id.toString(),
    }));

    return { success: true, data: itemHistoryWithStringId };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
});

ipcMain.handle("download-report", async (event, invoiceID, { htmlContent }) => {
  try {
    const report = await downloadReport(invoiceID, { htmlContent });
    return report;
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
});

ipcMain.handle("production-key", async (data) => {
  try {
    const response = await createProduction(data);
    return response;
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
});

let mainWindow;
let childWindows = new Map();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });
  mainWindow.maximize();
  // mainWindow.loadURL("http://localhost:5173");
  mainWindow.loadFile(path.join(__dirname, "frontend", "dist", "index.html"));
  isActivated(mainWindow);
  startAutoSync();

  // Menu.setApplicationMenu(null);
}

function openPopup(route, options = { width: 500, height: 400 }) {
  const popup = new BrowserWindow({
    width: options.width,
    height: options.height,
    parent: mainWindow,
    modal: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  popup.loadURL(
    `file://${path.join(__dirname, "frontend", "dist", "index.html")}#${route}`
  );
  popup.once("ready-to-show", () => popup.show());

  // Menu.setApplicationMenu(null);
}

ipcMain.on("open-popup", (event, route, options) => {
  openPopup(route, options);
});

let isReloading = false;

ipcMain.on("reload-main-window", () => {
  if (mainWindow && !isReloading) {
    isReloading = true;
    mainWindow.reload();
    setTimeout(() => (isReloading = false), 1000); // Reset after 1 second
  }
});

app.whenReady().then(async () => {
  await compassDB;
  await atlasDB;
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", async () => {
  if (compassDB) {
    await disconnectCompassDatabase();
    await disconnectAtlasDatabase();
  }
  if (process.platform !== "darwin") app.quit();
  app.quit();
});
