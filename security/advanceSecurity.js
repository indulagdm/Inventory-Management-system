import crypto from "crypto";
import keytar from "keytar";
import { ACCOUNT, ALGORITHM, SERVICE, KEY, IV } from "../utils/variable.js";

const encryption = async (text) => {
  try {
    const input = typeof text === "string" ? text : JSON.stringify(text);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
    let encrypted = cipher.update(input, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

const decryption = async (encryptedText) => {
  try {
    const input =
      typeof encryptedText === "string"
        ? encryptedText
        : JSON.stringify(encryptedText);
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
    let decrypted = decipher.update(input, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption Error", error);
  }
};

const saveKey = async (token) => {
  await keytar.setPassword(SERVICE, ACCOUNT, token);
};

const getKey = async () => {
  const token = await keytar.getPassword(SERVICE, ACCOUNT);
  return token;
};

const deleteKey = async () => {
  await keytar.deletePassword(SERVICE, ACCOUNT);
};

export { encryption, decryption, saveKey, getKey, deleteKey };
