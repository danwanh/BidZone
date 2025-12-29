import express from "express"
import {
    getAllQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsByProductId
} from "../controllers/questionController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("", getAllQuestions);
router.get("/:product_id", getQuestionsByProductId);
router.post("/", authenticate, createQuestion);
router.patch("/:id", authenticate, updateQuestion);
router.delete("/:id", authenticate, deleteQuestion);

export default router;