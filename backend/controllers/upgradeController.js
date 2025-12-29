import UpgradeRequest from "../models/upgrade_req.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// CREATE - Submit upgrade request (Bidder → Seller)
export const createUpgradeRequest = async (req, res) => {
  try {
    const {
      user_id,
      note = "",
      first_name = "",
      last_name = "",
      email = "",
      phone_number = "",
      address = "",
      city = "",
      province = "",
      postal = "",
      country = "",
    } = req.validated.body;
    // if (!mongoose.Types.ObjectId.isValid(user_id)) {
    //   return res.status(400).json({ message: "Invalid user_id" });
    // }

    // Check if user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already a seller
    if (user.role === "seller" || user.role === "admin") {
      return res
        .status(400)
        .json({ message: "User is already a seller or admin" });
    }

    // Check if there's already a pending request
    const existingRequest = await UpgradeRequest.findOne({
      user_id: user_id,
      status: "pending",
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "You already have a pending upgrade request" });
    }

    const newRequest = new UpgradeRequest({
      user_id: user_id,
      status: "pending",
      note: note,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      address: address,
      city: city,
      province: province,
      postal: postal,
      country: country,
      email: email,
    });

    await newRequest.save();

    res.status(201).json({
      message: "Upgrade request submitted successfully",
      request: newRequest,
    });
  } catch (err) {
    console.error("Error creating upgrade request:", err);
    res.status(500).json({ message: err.message });
  }
  console.log(60);
};

// READ - Get all upgrade requests (Admin only)
export const getAllUpgradeRequests = async (req, res) => {
  try {
    const { status, q = "" } = req.validated.query; // Filter by status if provided
    let query = {};
    if (status) {
      query.status = status;
    }
    if (q) {
      console.log(q);
      query.$or = [
        { first_name: { $regex: q, $options: "i" } },
        { last_name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    const requests = await UpgradeRequest.find(query)
      .populate("user_id", "username name email rating_pos rating_neg")
      .populate("admin_id", "name email")
      .sort({ createdAt: -1 }); // Newest first
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

    // if (!mongoose.Types.ObjectId.isValid(user_id)) {
    //   return res.status(400).json({ message: "Invalid user_id" });
    // }

    // Check authorization
    if (req.user._id.toString() !== user_id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const requests = await UpgradeRequest.find({ user_id })
      .populate("admin_id", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("Error getting user upgrade requests:", err);
    res.status(500).json({ message: err.message });
  }
};

// READ - Get single upgrade request by ID
export const getUpgradeRequestById = async (req, res) => {
  try {
    const { id } = req.validated.params;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: "Invalid request ID" });
    // }

    const request = await UpgradeRequest.findById(id)
      .populate("user_id", "name email rating_pos rating_neg")
      .populate("admin_id", "name email");

    if (!request) {
      return res.status(404).json({ message: "Upgrade request not found" });
    }

    // Check authorization
    const userId = req.user._id.toString();
    const isOwner = request.user_id._id.toString() === userId;

    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(request);
  } catch (err) {
    console.error("Error getting upgrade request:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE - Review upgrade request (Admin only)
export const reviewUpgradeRequest = async (req, res) => {
  try {
    const { id } = req.validated.params;
    const { status, note } = req.validated.body;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: "Invalid request ID" });
    // }

    // Validate status
    const validStatuses = ["accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be 'accepted' or 'rejected'" });
    }

    const request = await UpgradeRequest.findById(id).populate("user_id");
    if (!request) {
      return res.status(404).json({ message: "Upgrade request not found" });
    }

    // Check if already reviewed
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Request has already been reviewed" });
    }

    // Update request
    request.status = status;
    request.admin_id = req.user._id;
    if (note) {
      request.note = note;
    }
    await request.save();

    // If accepted, upgrade user to seller
    if (status === "accepted") {
      const user = await User.findById(request.user_id._id);
      user.role = "seller";
      await user.save();
    }

    const updatedRequest = await UpgradeRequest.findById(id)
      .populate("user_id", "name email role")
      .populate("admin_id", "name email");

    res.json({
      message: `Upgrade request ${status}`,
      request: updatedRequest,
    });
  } catch (err) {
    console.error("Error reviewing upgrade request:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE - Cancel upgrade request (User can cancel their own pending request)
export const cancelUpgradeRequest = async (req, res) => {
  try {
    const { id } = req.validated.params;
    console.log(id);

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: "Invalid request ID" });
    // }

    const request = await UpgradeRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Upgrade request not found" });
    }

    // Check authorization
    if (request.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only cancel your own requests" });
    }

    // Can only cancel pending requests
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Can only cancel pending requests" });
    }

    request.status = "rejected";
    request.note = "Cancelled by user";
    await request.save();

    res.json({ message: "Upgrade request cancelled", request });
  } catch (err) {
    console.error("Error cancelling upgrade request:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE - Delete upgrade request (Admin only)
export const deleteUpgradeRequest = async (req, res) => {
  try {
    const { id } = req.validated.params;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: "Invalid request ID" });
    // }

    const request = await UpgradeRequest.findByIdAndDelete(id);
    if (!request) {
      return res.status(404).json({ message: "Upgrade request not found" });
    }

    res.json({ message: "Upgrade request deleted successfully" });
  } catch (err) {
    console.error("Error deleting upgrade request:", err);
    res.status(500).json({ message: err.message });
  }
};
