import express from "express";
const router = express.Router();
import {
  createConfig,
  getConfig,
  updateConfig,
  deleteConfig,
  getAllConfigs,
} from "../controllers/configController.js";

import { authenticate } from "../middleware/authMiddleware.js";

// Tạo mới: POST /api/config
router.post("/", authenticate, createConfig);

router.get("/", authenticate, getAllConfigs);

// Lấy 1 biến: GET /api/config/PHI_SAN
router.get("/:key", authenticate, getConfig);

// Cập nhật: PUT /api/config/PHI_SAN
router.put("/:key", authenticate, updateConfig);

// Xóa: DELETE /api/config/PHI_SAN
router.delete("/:key", authenticate, deleteConfig);

export default router;
