import express from "express";
import {
  descriptionIdParamSchema,
  createDescriptionSchema,
  updateDescriptionSchema,
} from "../schemas/DesSchema.js";
import {
  getAllDescriptions,
  getDescriptionByID,
  createDescription,
  updateDescription,
  deleteDescription,
} from "../controllers/desController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/", getAllDescriptions);

router.get(
  "/:id",
  validate({ params: descriptionIdParamSchema }),
  getDescriptionByID
);

router.post(
  "/",
  authenticate,
  validate({ body: createDescriptionSchema }),
  createDescription
);

router.patch(
  "/:id",
  authenticate,
  validate({ params: descriptionIdParamSchema, body: updateDescriptionSchema }),
  updateDescription
);

router.delete(
  "/:id",
  authenticate,
  validate({ params: descriptionIdParamSchema }),
  deleteDescription
);

export default router;


