import regedit from "regedit";

export const checkCompassInstalled = async () => {
  return new Promise((resolve) => {
    const registryPaths = [
      "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
      "HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
    ];

    let found = false;

    regedit.list(registryPaths, function (err, results) {
      if (err) return resolve(false);

      for (const path of registryPaths) {
        const keys = results[path]?.keys || [];

        for (const key of keys) {
          const fullKey = `${path}\\${key}`;

          regedit.list(fullKey, function (err2, res) {
            if (err2) return;

            const values = res[fullKey]?.values;

            if (values?.DisplayName?.value?.includes("MongoDB Compass")) {
              found = true;
              resolve(true);
            }
          });
        }
      }

      // fallback after delay
      setTimeout(() => resolve(found), 1000);
    });
  });
};

// Example use:
checkCompassInstalled().then((installed) => {
  if (installed) {
    console.log("Compass is already installed");
  } else {
    console.log("Compass is NOT installed");
  }
});
