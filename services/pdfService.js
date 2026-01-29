import { spawn } from "child_process";
import path from "path";
import { app } from "electron";
import fs from "fs";
import { dirname } from "../utils/dirname.js";

const __dirname = dirname(import.meta.url);

function getPythonPath() {
  if (app.isPackaged) {
    return path.join(
      //   process.resourcesPath,
      //   "python",
      //   "venv",
      //   "Scripts",
      //   "python.exe",

      __dirname,
      "../",
      "convertors",
      "venv",
      "Scripts",
      "python.exe",
    );
  }
  return path.join(
    // process.cwd(),
    // "backend",
    // "python",
    // "venv",
    // "Scripts",
    // "python.exe",

    __dirname,
    "../",
    "convertors",
    "venv",
    "Scripts",
    "python.exe",
  );
}

function getScriptPath() {
  if (app.isPackaged) {
    return path.join(
      // process.resourcesPath, "python", "convert.py"
      __dirname,
      "../",
      "convertors",
      "convert.py",
    );
  }
  return path.join(
    // process.cwd(), "backend", "python", "convert.py"
    __dirname,
    "../",
    "convertors",
    "convert.py",
  );
}

export function convertDocxToPdf(inputDocxPath) {
  return new Promise((resolve, reject) => {
    const outputPdfPath = inputDocxPath.replace(".docx", ".pdf");

    const python = spawn(getPythonPath(), [
      getScriptPath(),
      inputDocxPath,
      outputPdfPath,
    ]);

    let result = "";
    let error = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(error);
      } else {
        resolve(result.trim());
      }
    });
  });
}
