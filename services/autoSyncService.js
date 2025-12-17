import { isOnline } from "../utils/internet.js";
import { syncLocalToCloud } from "./syncService.js";

const startAutoSync = () => {
  setInterval(async () => {
    const online = await isOnline();
    if (!online) {
      console.log("Offline — waiting for internet...");
      return;
    }

    console.log("Internet detected — syncing local → cloud");
    await syncLocalToCloud();
  }, 10000);
};

export { startAutoSync };
