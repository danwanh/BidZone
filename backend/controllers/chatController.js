import Chat from "../models/chat.model.js";
import mongoose from "mongoose";

// CREATE - Send a message
export const createMessage = async (req, res) => {
    try {
        const { seller_id, user_id, content } = req.body;

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(seller_id)) {
            return res.status(400).json({ message: "Invalid seller_id" });
        }
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ message: "Invalid user_id" });
        }

        // Validate content
        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Message content is required" });
        }

        // Check that sender is either the seller or the user
        const senderId = req.user._id.toString();
        if (senderId !== seller_id && senderId !== user_id) {
            return res.status(403).json({ message: "You can only send messages in your own conversations" });
        }

        const newMessage = new Chat({
            seller_id,
            user_id,
            content: content.trim()
        });

        await newMessage.save();
        
        const populatedMessage = await Chat.findById(newMessage._id)
            .populate("seller_id", "name")
            .populate("user_id", "name");

        res.status(201).json({ 
            message: "Message sent", 
            chat: populatedMessage 
        });
    } catch (err) {
        console.error("Error creating message:", err);
        res.status(500).json({ message: err.message });
    }
};

// READ - Get conversation between seller and user
export const getConversation = async (req, res) => {
    try {
        const { seller_id, user_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(seller_id)) {
            return res.status(400).json({ message: "Invalid seller_id" });
        }
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ message: "Invalid user_id" });
        }

        // Check that requester is part of this conversation
        const requesterId = req.user._id.toString();
        if (requesterId !== seller_id && requesterId !== user_id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const messages = await Chat.find({
            seller_id,
            user_id
        })
        .populate("seller_id", "name email")
        .populate("user_id", "name email")
        .sort({ createdAt: 1 }); // Oldest first

        res.json(messages);
    } catch (err) {
        console.error("Error getting conversation:", err);
        res.status(500).json({ message: err.message });
    }
};

// READ - Get all conversations for a user
export const getUserConversations = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ message: "Invalid user_id" });
        }

        // Check authorization
        if (req.user._id.toString() !== user_id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        // Find all conversations where user is either seller or user
        const conversations = await Chat.aggregate([
            {
                $match: {
                    $or: [
                        { seller_id: new mongoose.Types.ObjectId(user_id) },
                        { user_id: new mongoose.Types.ObjectId(user_id) }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        seller_id: "$seller_id",
                        user_id: "$user_id"
                    },
                    lastMessage: { $first: "$content" },
                    lastMessageTime: { $first: "$createdAt" },
                    messageCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id.seller_id",
                    foreignField: "_id",
                    as: "seller"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id.user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $project: {
                    seller_id: { $arrayElemAt: ["$seller", 0] },
                    user_id: { $arrayElemAt: ["$user", 0] },
                    lastMessage: 1,
                    lastMessageTime: 1,
                    messageCount: 1
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);

        res.json(conversations);
    } catch (err) {
        console.error("Error getting user conversations:", err);
        res.status(500).json({ message: err.message });
    }
};

// READ - Get single message by ID
export const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid message ID" });
        }

        const message = await Chat.findById(id)
            .populate("seller_id", "name email")
            .populate("user_id", "name email");

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.json(message);
    } catch (err) {
        console.error("Error getting message:", err);
        res.status(500).json({ message: err.message });
    }
};

// UPDATE - Edit a message (optional feature)
export const updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid message ID" });
        }

        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Message content is required" });
        }

        const message = await Chat.findById(id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Check if user is the sender (either seller or user who sent it)
        const userId = req.user._id.toString();
        const isSender = (message.seller_id.toString() === userId) || 
                        (message.user_id.toString() === userId);
        
        if (!isSender && req.user.role !== "admin") {
            return res.status(403).json({ message: "You can only edit your own messages" });
        }

        message.content = content.trim();
        await message.save();

        res.json({ message: "Message updated", chat: message });
    } catch (err) {
        console.error("Error updating message:", err);
        res.status(500).json({ message: err.message });
    }
};

// DELETE - Delete a message
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid message ID" });
        }

        const message = await Chat.findById(id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Check if user is the sender or admin
        const userId = req.user._id.toString();
        const isSender = (message.seller_id.toString() === userId) || 
                        (message.user_id.toString() === userId);
        
        if (!isSender && req.user.role !== "admin") {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }

        await Chat.findByIdAndDelete(id);
        res.json({ message: "Message deleted successfully" });
    } catch (err) {
        console.error("Error deleting message:", err);
        res.status(500).json({ message: err.message });
    }
};

// DELETE - Delete entire conversation
export const deleteConversation = async (req, res) => {
    try {
        const { seller_id, user_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(seller_id)) {
            return res.status(400).json({ message: "Invalid seller_id" });
        }
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ message: "Invalid user_id" });
        }

        // Check authorization
        const requesterId = req.user._id.toString();
        if (requesterId !== seller_id && requesterId !== user_id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const result = await Chat.deleteMany({
            seller_id,
            user_id
        });

        res.json({ 
            message: "Conversation deleted successfully",
            deletedCount: result.deletedCount
        });
    } catch (err) {
        console.error("Error deleting conversation:", err);
        res.status(500).json({ message: err.message });
    }
};
