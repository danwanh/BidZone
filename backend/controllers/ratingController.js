import * as ratingService from "../services/ratingService.js";

export const getAllRatings = async (req, res) => {
  try {
    const ratings = await ratingService.getAllRatings(req.validated.query);
    res.json(ratings);
  } catch (err) {
    console.error("Error getting ratings:", err);
    res.status(err.message === "Không tìm thấy đánh giá" ? 404 : 500).json({ message: err.message });
  }
};

export const getRatingByID = async (req, res) => {
  try {
    const rating = await ratingService.getRatingById(req.validated.params.id);
    res.json(rating);
  } catch (err) {
    res.status(err.message === "Can't find rating" ? 500 : 500).json({ message: err.message });
  }
};

export const createRating = async (req, res) => {
  try {
    const rating = await ratingService.createRating(req.validated.body);
    res.status(201).json(rating);
  } catch (err) {
    console.error(err);
    const status = err.message.includes("not found") ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

export const updateRating = async (req, res) => {
  try {
    const updated = await ratingService.updateRating(req.validated.params.id, req.validated.body);
    res.json(updated);
  } catch (err) {
    console.error("Error updating rating:", err);
    const status = err.message.includes("not found") ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

export const deleteRating = async (req, res) => {
  try {
    await ratingService.deleteRating(req.validated.params.id);
    res.json({ message: "Deleted rating" });
  } catch (err) {
    console.error("Error deleting rating:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getRatingsByUser = async (req, res) => {
  try {
    const ratings = await ratingService.getRatingsByUser(req.validated.params.userId);
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
