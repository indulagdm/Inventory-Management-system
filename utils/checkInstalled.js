import { checkCompassInstalled } from "./checkRegistry.js";
import { isCompassInstalledByPath } from "./checkPaths.js";

export const isCompassInstalled = async () => {
  try {
    const registry = await checkCompassInstalled();
    if (registry) return true;

    const pathCheck = await isCompassInstalledByPath();
    if (pathCheck) return true;
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

isCompassInstalled().then((found) => {
  console.log(found ? "Compass installed" : "Compass not installed.");
});
