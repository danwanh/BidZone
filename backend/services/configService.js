// services/configService.js
import SystemConfig from "../models/systemConfig.model.js";
import NodeCache from "node-cache";

// Tạo 1 cache riêng cho service này (hoặc export cache từ controller ra dùng chung)
const sysCache = new NodeCache({ stdTTL: 3600 }); // Cache 1 tiếng

exports.getVal = async (key) => {
  const upperKey = key.toUpperCase();

  // 1. Check Cache
  const cached = sysCache.get(upperKey);
  if (cached !== undefined) return cached;

  // 2. Check DB
  const config = await SystemConfig.findOne({ key: upperKey });

  // Giá trị mặc định nếu chưa set trong DB (để tránh lỗi code)
  let result = null;

  if (config) {
    result = config.value;
    sysCache.set(upperKey, result);
  }

  return result;
};

// Hàm xóa cache (Dùng khi Admin update config bên controller)
exports.clearCache = (key) => {
  sysCache.del(key.toUpperCase());
};
