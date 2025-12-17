import { LocalCategory, CloudCategory } from "../models/category.model.js";
import { LocalInvoice, CloudInvoice } from "../models/invoice.model.js";
import {
  LocalItemHistory,
  CloudItemHistory,
} from "../models/item.history.model.js";
import { LocalItem, CloudItem } from "../models/item.model.js";
import {
  LocalProduction,
  CloudProduction,
} from "../models/production.model.js";

const syncCollection = async (LocalModel, CloudModel) => {
  const unsync = await LocalModel.find({ synced: false });

  for (const doc of unsync) {
    try {
      await LocalModel.updateOne({ _id: doc._id }, { $set: { synced: true } });

      await CloudModel.updateOne(
        { _id: doc._id },
        { $set: doc.toObject() },
        { upsert: true }
      );

      console.log(`✔ Synced ${doc._id} from ${LocalModel.modelName}`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Failed to sync ${doc._id}:`, err.message);
      return { success: false, error: { message: error.message } };
    }
  }
};

const syncLocalToCloud = async () => {
  const collections = [
    {
      local: LocalCategory,
      cloud: CloudCategory,
    },
    {
      local: LocalInvoice,
      cloud: CloudInvoice,
    },
    {
      local: LocalItem,
      cloud: CloudItem,
    },
    {
      local: LocalItemHistory,
      cloud: CloudItemHistory,
    },
    {
      local: LocalProduction,
      cloud: CloudProduction,
    },
  ];
  for (const { local, cloud } of collections) {
    await syncCollection(local, cloud);
  }
};

export { syncLocalToCloud };
