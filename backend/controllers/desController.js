import * as desService from "../services/desService.js";

export const getAllDescriptions = async (req, res) => {
  try {
    const descriptions = await desService.getAllDescriptions();
    res.json(descriptions);
  } catch (err) {
    console.error("Error getting all descriptions:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getDescriptionByID = async (req, res) => {
  try {
    const description = await desService.getDescriptionById(req.validated.params.id);
    res.json(description);
  } catch (err) {
    res.status(err.message === "Can't find description" ? 500 : 500).json({ message: err.message });
  }
};

export const createDescription = async (req, res) => {
  try {
    const description = await desService.createDescription(req.validated.body);
    res.status(201).json(description);
  } catch (err) {
    console.error("Error creating description:", err);
    res.status(err.message === "Product not found" ? 404 : 500).json({ message: err.message });
  }
};

export const updateDescription = async (req, res) => {
  try {
    const updated = await desService.updateDescription(req.validated.params.id, req.validated.body);
    res.json(updated);
  } catch (err) {
    console.error("Error updating description:", err);
    res.status(err.message === "Can't find description" ? 500 : 500).json({ message: err.message });
  }
};

export const deleteDescription = async (req, res) => {
  try {
    await desService.deleteDescription(req.validated.params.id);
    res.json({ message: "Deleted description" });
  } catch (err) {
    console.error("Error deleting description:", err);
    res.status(500).json({ message: err.message });
  }
};
