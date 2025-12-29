import express from "express";
import {
  questionIdParamSchema,
  questionBodySchema,
} from "../schemas/QuestionSchema.js";
import {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByProductId,
} from "../controllers/questionController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("", getAllQuestions);
router.get(
  "/:product_id",
  validate({ params: questionIdParamSchema }),
  getQuestionsByProductId
);
router.post(
  "/",
  authenticate,
  validate({ body: questionBodySchema }),
  createQuestion
);
router.patch(
  "/:id",
  authenticate,
  validate({ params: questionIdParamSchema }),
  updateQuestion
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: questionIdParamSchema }),
  deleteQuestion
);

export default router;
