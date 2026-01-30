import fs from "fs";

const pathExists = (path) => {
  try {
    return fs.existsSync(path);
  } catch {
    return false;
  }
};

export const isCompassInstalledByPath = async () => {
  const paths = [
    "C:\\Program Files\\MongoDB Compass",
    "C:\\Program Files (x86)\\MongoDB Compass",
  ];

  return paths.some(pathExists);
};

console.log(isCompassInstalledByPath());
