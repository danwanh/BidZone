import express from "express";
import {
  ratingIdParamSchema,
  ratingUserIdParamSchema,
  ratingBodySchema,
} from "../schemas/RatingSchema.js";
import {
  getAllRatings,
  getRatingByID,
  createRating,
  updateRating,
  deleteRating,
  getRatingsByUser,
} from "../controllers/ratingController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("", authenticate, getAllRatings);
router.get(
  "/each/:id",
  validate({ params: ratingIdParamSchema }),
  getRatingByID
);

router.get(
  "/user/:userId",
  authenticate,
  validate({ params: ratingUserIdParamSchema }),
  getRatingsByUser
);

router.post(
  "/",
  authenticate,
  validate({ body: ratingBodySchema }),
  createRating
);

router.patch(
  "/:id",
  authenticate,
  validate({ params: ratingIdParamSchema, body: ratingBodySchema }),
  updateRating
);

router.delete(
  "/:id",
  authenticate,
  validate({ params: ratingIdParamSchema }),
  deleteRating
);

export default router;
