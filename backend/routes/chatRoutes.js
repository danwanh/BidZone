import express from "express";
import {
  messageIdParamSchema,
  conversationParamSchema,
  userIdParamSchema,
  createMessageSchema,
  updateMessageSchema,
} from "../schemas/ChatSchema.js";
import {
  createMessage,
  getConversation,
  getUserConversations,
  getMessageById,
  updateMessage,
  deleteMessage,
  deleteConversation,
} from "../controllers/chatController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

// CREATE
// POST /api/chat
// Protected: Send a message
router.post(
  "/",
  authenticate,
  validate({ body: createMessageSchema }),
  createMessage
);

// READ
// GET /api/chat/conversation/:seller_id/:user_id
// Protected: Get conversation between seller and user
router.get(
  "/conversation/:seller_id/:user_id",
  authenticate,
  validate({ params: conversationParamSchema }),
  getConversation
);

// GET /api/chat/user/:user_id
// Protected: Get all conversations for a user
router.get(
  "/user/:user_id",
  authenticate,
  validate({ params: userIdParamSchema }),
  getUserConversations
);

// GET /api/chat/:id
// Protected: Get single message by ID
router.get(
  "/:id",
  authenticate,
  validate({ params: messageIdParamSchema }),
  getMessageById
);

// UPDATE
// PUT /api/chat/:id
// Protected: Edit a message
router.put(
  "/:id",
  authenticate,
  validate({ params: messageIdParamSchema }),
  updateMessage
);

// DELETE
// DELETE /api/chat/:id
// Protected: Delete a single message
router.delete(
  "/:id",
  authenticate,
  validate({ params: messageIdParamSchema }),
  deleteMessage
);

// DELETE /api/chat/conversation/:seller_id/:user_id
// Protected: Delete entire conversation
router.delete(
  "/conversation/:seller_id/:user_id",
  authenticate,
  validate({ params: conversationParamSchema }),
  deleteConversation
);

export default router;
