import express from "express"
import {
    getAllQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsByProductId
} from "../controllers/questionController.js";

const router = express.Router();

router.get("", getAllQuestions);
router.get("/:product_id", getQuestionsByProductId);
router.post("/", createQuestion);
router.patch("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

export default router;