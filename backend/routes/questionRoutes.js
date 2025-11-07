import express from "express"
import {
    getAllQuestions,
    getQuestionByID,
    createQuestion,
    updateQuestion,
    deleteQuestion
} from "../controllers/questionController.js";

const router = express.Router();

router.get("", getAllQuestions);
router.get("/:id", getQuestionByID);
router.post("/", createQuestion);
router.patch("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

export default router;