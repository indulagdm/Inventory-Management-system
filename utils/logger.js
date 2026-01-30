import { app } from "electron";
import { type, arch } from "os";
import { join } from "path";
import { mkdir, appendFile } from "fs/promises";
import { sendMail } from "../services/mailService.js";
import { GOOGLE_MAIL } from "../utils/variable.js";

const log = async (message, filename) => {
  const timestamp = new Date().toLocaleString("en-LK", {
    timeZone: "Asia/Colombo",
  });

  const logEntry = `[${timestamp}] [${
    app.isPackaged ? "Packaged" : "Dev"
  }] [message:${message}] [filename:${filename}]\n`;

  const logEntryForEmail = `${logEntry} [Type:${type()}] [Architecture:${arch()}]`;

  const logdir = app.isPackaged
    ? join(process.resourcesPath, "logs")
    : join(__dirname, "..", "logs");

  const logFilePath = join(logdir, "error.log");

  mkdir(logdir, { recursive: true }).catch((err) =>
    console.error("Failed to create log dir:", err),
  );

  if (message.includes("Error") || message.includes("Failed")) {
    appendFile(logFilePath, logEntry).catch((err) =>
      console.error("Failed to write to log file:", err),
    );
  }

  await sendMail({
    to: GOOGLE_MAIL,
    subject: "Logger Data from Agrovista Inventory Management System",
    text: logEntryForEmail,
  });
};

export { log };
