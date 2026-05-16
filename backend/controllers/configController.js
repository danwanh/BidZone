import * as configService from "../services/configService.js";

export const createConfig = async (req, res) => {
  try {
    const newConfig = await configService.createConfig(req.body);
    res.status(201).json({ success: true, data: newConfig });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getConfig = async (req, res) => {
  try {
    const result = await configService.getConfigByKey(req.params.key);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(error.message === "Key not found" ? 404 : 500).json({ success: false, message: error.message });
  }
};

export const getAllConfigs = async (req, res) => {
  try {
    const configs = await configService.getAllConfigs();
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
    const updatedConfig = await configService.updateConfig(req.params.key, req.body);
    res.json({ success: true, data: updatedConfig });
  } catch (error) {
    res.status(error.message === "Key not found" ? 404 : 500).json({ success: false, message: error.message });
  }
};

export const deleteConfig = async (req, res) => {
  try {
    await configService.deleteConfig(req.params.key);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(error.message === "Key not found" ? 404 : 500).json({ success: false, message: error.message });
  }
};



