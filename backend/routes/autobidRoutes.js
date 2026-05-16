import express from "express";
import {
  idParamSchema,
  createAutoBidSchema,
  updateBidStatusSchema,
} from "../schemas/AutobidSchema.js";
import {
  createAutoBid,
  getAutoBidsByProduct,
  getAllAutoBids,
  deleteAutoBid,
  getAutoBidById,
  updateBidStatus,
  rejectAutoBid,
} from "../controllers/autobidController.js";
import {
  bidIdParamSchema,
  bidProductIdParamSchema,
} from "../schemas/BidSchema.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate({ body: createAutoBidSchema }),
  createAutoBid
);

router.get("/", authenticate, getAllAutoBids);

router.get("/:id", authenticate, getAutoBidById);

router.get(
  "/product/:product_id",
  authenticate,
  validate({ params: bidProductIdParamSchema }),
  getAutoBidsByProduct
);

router.delete(
  "/:id",
  authenticate,
  validate({ params: bidIdParamSchema }),
  deleteAutoBid
);

router.patch(
  "/:id",
  authenticate,
  validate({ params: idParamSchema }),
  updateBidStatus
);

router.patch(
  "/:id/reject",
  authenticate,
  validate({ params: idParamSchema, body: updateBidStatusSchema }),
  rejectAutoBid
);

export default router;


