import UpgradeRequest from "../models/upgradeReqModel.js";
import User from "../models/userModel.js";

export const createUpgradeRequest = async (requestData) => {
  const { user_id, note = "", name = "", email = "", phone_number = "", address = "", city = "", province = "", postal = "", country = "" } = requestData;

  const user = await User.findById(user_id);
  if (!user) throw new Error("User not found");

  if (user.role === "seller" || user.role === "admin") {
    throw new Error("User is already a seller or admin");
  }

  const existingRequest = await UpgradeRequest.findOne({ user_id, status: "pending" });
  if (existingRequest) throw new Error("You already have a pending upgrade request");

  const newRequest = new UpgradeRequest({
    user_id, status: "pending", note, name, phone_number, address, city, province, postal, country, email
  });

  return await newRequest.save();
};

export const getAllUpgradeRequests = async (queryParams) => {
  const { status, q = "" } = queryParams;
  let query = {};
  if (status) query.status = status;
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
  }

  return await UpgradeRequest.find(query)
    .populate("user_id", "username name email rating_pos rating_neg")
    .populate("admin_id", "name email")
    .sort({ createdAt: -1 });
};

export const getUpgradeRequestsByUser = async (userId) => {
  return await UpgradeRequest.find({ user_id: userId })
    .populate("admin_id", "name email")
    .sort({ createdAt: -1 });
};

export const getUpgradeRequestById = async (id) => {
  const request = await UpgradeRequest.findById(id)
    .populate("user_id", "name email rating_pos rating_neg")
    .populate("admin_id", "name email");
  if (!request) throw new Error("Upgrade request not found");
  return request;
};

export const reviewUpgradeRequest = async (id, adminId, reviewData) => {
  const { status, note } = reviewData;

  const validStatuses = ["accepted", "rejected"];
  if (!validStatuses.includes(status)) throw new Error("Status must be 'accepted' or 'rejected'");

  const request = await UpgradeRequest.findById(id).populate("user_id");
  if (!request) throw new Error("Upgrade request not found");

  if (request.status !== "pending") throw new Error("Request has already been reviewed");

  request.status = status;
  request.admin_id = adminId;
  if (note) request.note = note;
  await request.save();

  if (status === "accepted") {
    const user = await User.findById(request.user_id._id);
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    user.seller_expires = sevenDaysLater;
    user.role = "seller";
    await user.save();
  }

  return await UpgradeRequest.findById(id)
    .populate("user_id", "name email role")
    .populate("admin_id", "name email");
};

export const cancelUpgradeRequest = async (id, userId) => {
  const request = await UpgradeRequest.findById(id);
  if (!request) throw new Error("Upgrade request not found");

  if (request.user_id.toString() !== userId) throw new Error("You can only cancel your own requests");
  if (request.status !== "pending") throw new Error("Can only cancel pending requests");

  request.status = "rejected";
  request.note = "Cancelled by user";
  return await request.save();
};

export const deleteUpgradeRequest = async (id) => {
  const request = await UpgradeRequest.findByIdAndDelete(id);
  if (!request) throw new Error("Upgrade request not found");
  return request;
};
