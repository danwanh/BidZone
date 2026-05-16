import Question from "../models/questionModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import appEvent from "./mailSystem/mailEvents.js";

export const getAllQuestions = async () => {
  return await Question.find();
};

export const getQuestionsByProductId = async (product_id) => {
  return await Question.find({ product_id })
    .populate("bidder_id", "name email")
    .populate("seller_id", "name email")
    .sort({ createdAt: -1 });
};

export const createQuestion = async (questionData) => {
  const { product_id, seller_id, bidder_id, question, answer } = questionData;

  if (seller_id === bidder_id) throw new Error("User can't ask/answer themself");

  const newQuestion = new Question({ product_id, seller_id, bidder_id, question, answer });
  const saved = await newQuestion.save();

  const seller = await User.findById(seller_id);
  const product = await Product.findById(product_id);

  appEvent.emit("QUESTION_ASKED", { seller, question: saved, product });

  return saved;
};

export const updateQuestion = async (id, updateData) => {
  const { answer } = updateData;
  const question = await Question.findById(id);
  if (!question) throw new Error("Can't find question");

  if (answer) question.answer = answer;
  const updated = await Question.findByIdAndUpdate(id, question, { new: true });

  if (answer) {
    appEvent.emit("QUESTION_ANSWERED", {
      buyer: await User.findById(updated.bidder_id),
      question: updated,
      product: await Product.findById(updated.product_id),
    });
  }

  return updated;
};

export const deleteQuestion = async (id) => {
  const deleted = await Question.findByIdAndDelete(id);
  if (!deleted) throw new Error("Failed to delete question");
  return deleted;
};
