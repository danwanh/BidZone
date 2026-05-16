import * as upgradeService from "../services/upgradeService.js";

// CREATE - Submit upgrade request (Bidder → Seller)
export const createUpgradeRequest = async (req, res) => {
  try {
    const request = await upgradeService.createUpgradeRequest(req.validated.body);
    res.status(201).json({
      message: "Upgrade request submitted successfully",
      request,
    });
  } catch (err) {
    console.error("Error creating upgrade request:", err);
    const status = err.message === "User not found" ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

// READ - Get all upgrade requests (Admin only)
export const getAllUpgradeRequests = async (req, res) => {
  try {
    const requests = await upgradeService.getAllUpgradeRequests(req.query);
    res.json(requests);
  } catch (err) {
    console.error("Error getting upgrade requests:", err);
    res.status(500).json({ message: err.message });
  }
};

// READ - Get upgrade requests by user
export const getUpgradeRequestsByUser = async (req, res) => {
  try {
    const { user_id } = req.validated.params;
    if (req.user._id.toString() !== user_id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const requests = await upgradeService.getUpgradeRequestsByUser(user_id);
    res.json(requests);
  } catch (err) {
    console.error("Error getting user upgrade requests:", err);
    res.status(500).json({ message: err.message });
  }
};

// READ - Get single upgrade request by ID
export const getUpgradeRequestById = async (req, res) => {
  try {
    const request = await upgradeService.getUpgradeRequestById(req.validated.params.id);
    const userId = req.user._id.toString();
    const isOwner = request.user_id._id.toString() === userId;

    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(request);
  } catch (err) {
    console.error("Error getting upgrade request:", err);
    res.status(err.message === "Upgrade request not found" ? 404 : 500).json({ message: err.message });
  }
};

// UPDATE - Review upgrade request (Admin only)
export const reviewUpgradeRequest = async (req, res) => {
  try {
    const request = await upgradeService.reviewUpgradeRequest(req.validated.params.id, req.user._id, req.validated.body);
    res.json({
      message: `Upgrade request ${req.validated.body.status}`,
      request,
    });
  } catch (err) {
    console.error("Error reviewing upgrade request:", err);
    const status = err.message === "Upgrade request not found" ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

// UPDATE - Cancel upgrade request (User can cancel their own pending request)
export const cancelUpgradeRequest = async (req, res) => {
  try {
    const request = await upgradeService.cancelUpgradeRequest(req.validated.params.id, req.user._id.toString());
    res.json({ message: "Upgrade request cancelled", request });
  } catch (err) {
    console.error("Error cancelling upgrade request:", err);
    const status = err.message === "Upgrade request not found" ? 404 : err.message === "You can only cancel your own requests" ? 403 : 400;
    res.status(status).json({ message: err.message });
  }
};

// DELETE - Delete upgrade request (Admin only)
export const deleteUpgradeRequest = async (req, res) => {
  try {
    await upgradeService.deleteUpgradeRequest(req.validated.params.id);
    res.json({ message: "Upgrade request deleted successfully" });
  } catch (err) {
    console.error("Error deleting upgrade request:", err);
    res.status(err.message === "Upgrade request not found" ? 404 : 500).json({ message: err.message });
  }
};
