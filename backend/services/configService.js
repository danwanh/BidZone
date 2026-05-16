import SystemConfig from "../models/systemConfigModel.js";
import NodeCache from "node-cache";

// Tạo 1 cache riêng cho service này
const sysCache = new NodeCache({ stdTTL: 3600 }); // Cache 1 tiếng

export const getVal = async (key) => {
  const upperKey = key.toUpperCase();

  // 1. Check Cache
  const cached = sysCache.get(upperKey);
  if (cached !== undefined) return cached;

  // 2. Check DB
  const config = await SystemConfig.findOne({ key: upperKey });

  let result = null;
  if (config) {
    result = config.value;
    sysCache.set(upperKey, result);
  }

  return result;
};

export const clearCache = (key) => {
  sysCache.del(key.toUpperCase());
};

export const createConfig = async (configData) => {
  const { key, value, extend } = configData;
  const upperKey = key.toUpperCase();
  
  const newConfig = await SystemConfig.create({ key: upperKey, value, extend });
  sysCache.set(upperKey, value);
  return newConfig;
};

export const getAllConfigs = async () => {
  return await SystemConfig.find().sort({ key: 1 });
};

export const getConfigByKey = async (key) => {
  const upperKey = key.toUpperCase();
  
  // Check Cache first
  const cachedValue = sysCache.get(upperKey);
  if (cachedValue !== undefined) {
    return { value: cachedValue, source: "cache" };
  }

  const config = await SystemConfig.findOne({ key: upperKey });
  if (!config) throw new Error("Key not found");

  sysCache.set(upperKey, config.value);
  return { value: config.value, source: "database", data: config };
};

export const updateConfig = async (key, updateData) => {
  const upperKey = key.toUpperCase();
  const { value, extend } = updateData;

  const updatedConfig = await SystemConfig.findOneAndUpdate(
    { key: upperKey },
    { value, extend },
    { new: true }
  );

  if (!updatedConfig) throw new Error("Key not found");

  sysCache.set(upperKey, value);
  return updatedConfig;
};

export const deleteConfig = async (key) => {
  const upperKey = key.toUpperCase();
  const deleted = await SystemConfig.findOneAndDelete({ key: upperKey });
  
  if (!deleted) throw new Error("Key not found");

  sysCache.del(upperKey);
  return deleted;
};



