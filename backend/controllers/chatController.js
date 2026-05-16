import * as chatService from "../services/chatService.js";

// CREATE - Send a message
export const createMessage = async (req, res) => {
  try {
    const chat = await chatService.createMessage(req.validated.body, req.user._id.toString());
    res.status(201).json({
      message: "Message sent",
      chat,
    });
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(err.message === "You can only send messages in your own conversations" ? 403 : 500).json({ message: err.message });
  }
};

// READ - Get conversation between seller and user
export const getConversation = async (req, res) => {
  try {
    const { seller_id, user_id } = req.validated.params;
    const messages = await chatService.getConversation(seller_id, user_id, req.user._id.toString(), req.user.role);
    res.json(messages);
  } catch (err) {
    console.error("Error getting conversation:", err);
    res.status(err.message === "Access denied" ? 403 : 500).json({ message: err.message });
  }
};

// READ - Get all conversations for a user
export const getUserConversations = async (req, res) => {
  try {
    const { user_id } = req.validated.params;
    if (req.user._id.toString() !== user_id) {
      return res.status(403).json({ message: "Access denied" });
    }
    const conversations = await chatService.getUserConversations(user_id);
    res.json(conversations);
  } catch (err) {
    console.error("Error getting user conversations:", err);
    res.status(500).json({ message: err.message });
  }
};

// READ - Get single message by ID
export const getMessageById = async (req, res) => {
  try {
    const message = await chatService.getMessageById(req.validated.params.id);
    res.json(message);
  } catch (err) {
    console.error("Error getting message:", err);
    res.status(err.message === "Message not found" ? 404 : 500).json({ message: err.message });
  }
};

// UPDATE - Edit a message (optional feature)
export const updateMessage = async (req, res) => {
  try {
    const chat = await chatService.updateMessage(req.validated.params.id, req.validated.body.content, req.user._id.toString(), req.user.role);
    res.json({ message: "Message updated", chat });
  } catch (err) {
    console.error("Error updating message:", err);
    const status = err.message === "Message not found" ? 404 : err.message === "You can only edit your own messages" ? 403 : 500;
    res.status(status).json({ message: err.message });
  }
};

// DELETE - Delete a message
export const deleteMessage = async (req, res) => {
  try {
    await chatService.deleteMessage(req.validated.params.id, req.user._id.toString(), req.user.role);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Error deleting message:", err);
    const status = err.message === "Message not found" ? 404 : err.message === "You can only delete your own messages" ? 403 : 500;
    res.status(status).json({ message: err.message });
  }
};

// DELETE - Delete entire conversation
export const deleteConversation = async (req, res) => {
  try {
    const { seller_id, user_id } = req.validated.params;
    const result = await chatService.deleteConversation(seller_id, user_id, req.user._id.toString());
    res.json({
      message: "Conversation deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting conversation:", err);
    res.status(err.message === "Access denied" ? 403 : 500).json({ message: err.message });
  }
};
