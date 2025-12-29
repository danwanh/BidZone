import SystemConfig from "../models/system_config.model.js";

import NodeCache from "node-cache";
const myCache = new NodeCache({ stdTTL: 0 });

export const createConfig = async (req, res) => {
  try {
    const { key, value } = req.body;

    const newConfig = await SystemConfig.create({ key, value });

    // Lưu ngay vào cache
    myCache.set(key.toUpperCase(), value);

    res.status(201).json({ success: true, data: newConfig });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getConfig = async (req, res) => {
  try {
    const key = req.params.key.toUpperCase();

    // BƯỚC 1: Kiểm tra Cache
    const cachedValue = myCache.get(key);
    if (cachedValue !== undefined) {
      return res.json({ success: true, value: cachedValue, source: "cache" });
    }

    // BƯỚC 2: Nếu Cache không có, tìm trong DB
    const config = await SystemConfig.findOne({ key });

    if (!config) {
      return res.status(404).json({ success: false, message: "Key not found" });
    }

    // BƯỚC 3: Lưu vào Cache để lần sau dùng
    myCache.set(key, config.value);

    res.json({ success: true, value: config.value, source: "database" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllConfigs = async (req, res) => {
  try {
    // Tìm tất cả và sắp xếp theo Key (A-Z) cho dễ nhìn
    const configs = await SystemConfig.find().sort({ key: 1 });

    // API trả về mảng data
    res.json({
      success: true,
      count: configs.length,
      data: configs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateConfig = async (req, res) => {
  try {
    const key = req.params.key.toUpperCase();
    const { value } = req.body;

    const updatedConfig = await SystemConfig.findOneAndUpdate(
      { key },
      { value },
      { new: true } // Trả về data mới sau khi update
    );

    if (!updatedConfig) {
      return res.status(404).json({ success: false, message: "Key not found" });
    }

    // QUAN TRỌNG: Cập nhật lại Cache ngay lập tức
    myCache.set(key, value);

    res.json({ success: true, data: updatedConfig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteConfig = async (req, res) => {
  try {
    const key = req.params.key.toUpperCase();

    const deleted = await SystemConfig.findOneAndDelete({ key });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Key not found" });
    }

    // QUAN TRỌNG: Xóa khỏi Cache
    myCache.del(key);

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
