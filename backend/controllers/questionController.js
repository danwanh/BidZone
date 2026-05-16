import * as questionService from "../services/questionService.js";

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await questionService.getAllQuestions();
    res.json(questions);
  } catch (err) {
    console.error("Error getting all questions:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getQuestionsByProductId = async (req, res) => {
  try {
    const questions = await questionService.getQuestionsByProductId(req.validated.params.product_id);
    res.json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const question = await questionService.createQuestion(req.validated.body);
    res.status(201).json(question);
  } catch (err) {
    console.error("Error creating question:", err);
    res.status(err.message === "User can't ask/answer themself" ? 400 : 500).json({ message: err.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const updated = await questionService.updateQuestion(req.validated.params.id, req.validated.body);
    res.json(updated);
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(err.message === "Can't find question" ? 500 : 500).json({ message: err.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await questionService.deleteQuestion(req.validated.params.id);
    res.json({ message: "Deleted question" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ message: err.message });
  }
};
