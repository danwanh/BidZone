import Chat from "../models/chatModel.js";
import mongoose from "mongoose";

export const createMessage = async (messageData, senderId) => {
  const { seller_id, user_id, content } = messageData;

  if (senderId !== seller_id && senderId !== user_id) {
    throw new Error("You can only send messages in your own conversations");
  }

  const newMessage = new Chat({
    seller_id,
    user_id,
    content: content.trim(),
  });

  await newMessage.save();

  return await Chat.findById(newMessage._id)
    .populate("seller_id", "name")
    .populate("user_id", "name");
};

export const getConversation = async (seller_id, user_id, requesterId, requesterRole) => {
  if (requesterId !== seller_id && requesterId !== user_id && requesterRole !== "admin") {
    throw new Error("Access denied");
  }

  return await Chat.find({ seller_id, user_id })
    .populate("seller_id", "name email")
    .populate("user_id", "name email")
    .sort({ createdAt: 1 });
};

export const getUserConversations = async (userId) => {
  return await Chat.aggregate([
    {
      $match: {
        $or: [
          { seller_id: new mongoose.Types.ObjectId(userId) },
          { user_id: new mongoose.Types.ObjectId(userId) },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: { seller_id: "$seller_id", user_id: "$user_id" },
        lastMessage: { $first: "$content" },
        lastMessageTime: { $first: "$createdAt" },
        messageCount: { $sum: 1 },
      },
    },
    {
      $lookup: { from: "users", localField: "_id.seller_id", foreignField: "_id", as: "seller" },
    },
    {
      $lookup: { from: "users", localField: "_id.user_id", foreignField: "_id", as: "user" },
    },
    {
      $project: {
        seller_id: { $arrayElemAt: ["$seller", 0] },
        user_id: { $arrayElemAt: ["$user", 0] },
        lastMessage: 1,
        lastMessageTime: 1,
        messageCount: 1,
      },
    },
    { $sort: { lastMessageTime: -1 } },
  ]);
};

export const getMessageById = async (id) => {
  const message = await Chat.findById(id)
    .populate("seller_id", "name email")
    .populate("user_id", "name email");
  if (!message) throw new Error("Message not found");
  return message;
};

export const updateMessage = async (id, content, userId, userRole) => {
  const message = await Chat.findById(id);
  if (!message) throw new Error("Message not found");

  const isSender = message.seller_id.toString() === userId || message.user_id.toString() === userId;
  if (!isSender && userRole !== "admin") {
    throw new Error("You can only edit your own messages");
  }

  message.content = content.trim();
  return await message.save();
};

export const deleteMessage = async (id, userId, userRole) => {
  const message = await Chat.findById(id);
  if (!message) throw new Error("Message not found");

  const isSender = message.seller_id.toString() === userId || message.user_id.toString() === userId;
  if (!isSender && userRole !== "admin") {
    throw new Error("You can only delete your own messages");
  }

  return await Chat.findByIdAndDelete(id);
};

export const deleteConversation = async (seller_id, user_id, requesterId) => {
  if (requesterId !== seller_id && requesterId !== user_id) {
    throw new Error("Access denied");
  }

  return await Chat.deleteMany({ seller_id, user_id });
};
