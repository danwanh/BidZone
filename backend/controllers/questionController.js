import Question from "../models/question.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error("Error getting all questions:", err);
    res.status(500).json({ message: err.message });
  }
};

// export const getQuestionByID = async (req, res) => {
//     await getQuestion(req, res);
//     if (!res.question)
//         return res;
//     res.json(res.question);
// };
export const getQuestionsByProductId = async (req, res) => {
  try {
    const { product_id } = req.params;
    const questions = await Question.find({ product_id }).populate("bidder_id", "name email");
    res.json(questions);
  } catch (err) {
    console.error("Error fetching bids:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { product_id, seller_id, bidder_id, question, answer } = req.body;

    if (!mongoose.Types.ObjectId.isValid(product_id)) {
      return res
        .status(400)
        .json({ message: "Invalid product_id ObjectId format" });
    } else if (!mongoose.Types.ObjectId.isValid(seller_id)) {
      return res
        .status(400)
        .json({ message: "Invalid seller_id ObjectId format" });
    } else if (!mongoose.Types.ObjectId.isValid(bidder_id)) {
      return res
        .status(400)
        .json({ message: "Invalid bidder_id ObjectId format" });
    }

    if (!product_id || !seller_id || !bidder_id || !question) {
      return res.status(400).json({ message: "Missing required fields" });
    } else if (seller_id === bidder_id) {
      return res
        .status(400)
        .json({ message: "User can't ask/answer themself " });
    }

    const newQuestion = new Question({
      product_id,
      seller_id,
      bidder_id,
      question,
      answer,
    });
    const save = await newQuestion.save();
    res.status(201).json(save);
  } catch (err) {
    console.error("Error creating question:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateQuestion = async (req, res) => {
  const { product_id, seller_id, bidder_id, question, answer } = req.body;
  try {
    await getQuestion(req, res);
    if (!res.question) return res;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ObjectId format" });
    }

    // if (product_id) question.product_id = product_id;
    // if(seller_id) question.seller_id = seller_id;
    // if (bidder_id) question.bidder_id = bidder_id;

    //if (question) res.question.question = question;
    if (answer) res.question.answer = answer;
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      res.question,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await getQuestion(req, res);
    if (!res.question) return res;

    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(500).json({ message: "Failed to delete question" });

    res.json({ message: "Deleted question" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ message: err.message });
  }
};

async function getQuestion(req, res) {
  let question;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ObjectId format" });
    }

    question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(500).json({ message: "Can't find question" });
    }
  } catch (err) {
    console.error("Error getting question by ID:", err);
    return res.status(500).json({ message: err.message });
  }
  res.question = question;
}
