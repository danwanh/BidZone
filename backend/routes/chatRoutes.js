import express from "express";
import {
    createMessage,
    getConversation,
    getUserConversations,
    getMessageById,
    updateMessage,
    deleteMessage,
    deleteConversation
} from "../controllers/chatController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
// POST /api/chat
// Protected: Send a message
router.post("/", authenticate, createMessage);

// READ
// GET /api/chat/conversation/:seller_id/:user_id
// Protected: Get conversation between seller and user
router.get("/conversation/:seller_id/:user_id", authenticate, getConversation);

// GET /api/chat/user/:user_id
// Protected: Get all conversations for a user
router.get("/user/:user_id", authenticate, getUserConversations);

// GET /api/chat/:id
// Protected: Get single message by ID
router.get("/:id", authenticate, getMessageById);

// UPDATE
// PUT /api/chat/:id
// Protected: Edit a message
router.put("/:id", authenticate, updateMessage);

// DELETE
// DELETE /api/chat/:id
// Protected: Delete a single message
router.delete("/:id", authenticate, deleteMessage);

// DELETE /api/chat/conversation/:seller_id/:user_id
// Protected: Delete entire conversation
router.delete("/conversation/:seller_id/:user_id", authenticate, deleteConversation);

export default router;
