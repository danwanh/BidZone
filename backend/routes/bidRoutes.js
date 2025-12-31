import express from "express";
import {
  bidIdParamSchema,
  bidProductIdParamSchema,
  createBidSchema,
  updateBidStatusSchema,
} from "../schemas/BidSchema.js";
import {
  createBid,
  getBidsByProduct,
  getAllBids,
  deleteBid,
  getBidByUser,
  getBiddingByUser,
  getBidById,
  updateBidStatus,
  rejectBid,
} from "../controllers/bidController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/", authenticate, validate({ body: createBidSchema }), createBid);

router.get("/:id", validate({ params: bidIdParamSchema }), getBidById);

router.get(
  "/product/:product_id",
  validate({ params: bidProductIdParamSchema }),
  getBidsByProduct
);

router.get("/user/:id", validate({ params: bidIdParamSchema }), getBidByUser);

router.get(
  "/user/bidding/:id",
  validate({ params: bidIdParamSchema }),
  getBiddingByUser
);

router.get("/", getAllBids);

router.patch(
  "/:id",
  authenticate,
  validate({ params: bidIdParamSchema, body: updateBidStatusSchema }),
  updateBidStatus
);

router.delete(
  "/:id",
  authenticate,
  validate({ params: bidIdParamSchema }),
  deleteBid
);

router.patch(
  "/:id/reject",
  authenticate,
  validate({ params: bidIdParamSchema }),
  rejectBid
);

export default router;
