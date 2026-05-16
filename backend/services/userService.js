import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (queryParams) => {
  const { role, q = "", is_deleted = false } = queryParams;
  let query = { is_deleted };
  if (role) query.role = role;

  if (q) {
    query.$or = [
      { username: { $regex: q, $options: "i" } },
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
  }

  return await User.find(query).select("-password_hash -reset_password_token");
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select("-password_hash -reset_password_token");
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUser = async (id, updateData) => {
  const {
    name, email, phonenumber, address, dob, password, gender, username, $inc
  } = updateData;

  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  if (name) user.name = name;
  if (email) {
    const emailExists = await User.findOne({ email, _id: { $ne: id } });
    if (emailExists) throw new Error("Email already in use");
    user.email = email;
  }
  if (phonenumber) user.phone = phonenumber;
  if (address) user.address = address;
  if (dob) user.dob = dob;
  if (gender) user.gender = gender;
  if (username) user.username = username;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(password, salt);
  }

  await user.save();

  if ($inc && Object.keys($inc).length > 0) {
    await User.findByIdAndUpdate(id, { $inc });
  }

  return await User.findById(id).select("-password_hash -reset_password_token");
};

export const updateUserRole = async (id, role) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  user.role = role;
  return await user.save();
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found");
  return user;
};

export const rateUp = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("No user with that id");
  user.rating_pos = (user.rating_pos || 0) + 1;
  return await user.save();
};

export const rateDown = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("No user with that id");
  user.rating_neg = (user.rating_neg || 0) + 1;
  return await user.save();
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.password_hash) {
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) throw new Error("Wrong password");
  }

  const salt = await bcrypt.genSalt(10);
  user.password_hash = await bcrypt.hash(newPassword, salt);
  return await user.save();
};

export const createUser = async (userData) => {
  const { username, name, address, dob, email, password, gender } = userData;
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const user = new User({
    username, name, address, dob, email, gender, password_hash,
    seller_expires: null, social_is: "", is_verified: true,
    reset_password_expires: true, reset_password_token: "",
    otp_expires: true, rating_pos: 0, rating_neg: 0, is_private: false,
  });
  return await user.save();
};

export const setPrivateStatus = async (userId, isPrivate) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("No user found");
  user.is_private = isPrivate;
  return await user.save();
};

export const softDeleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  user.is_deleted = true;
  return await user.save();
};
