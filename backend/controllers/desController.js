import Description from "../models/description_list.model.js";
import mongoose from "mongoose";

export const getAllDescriptions = async (req, res) => {
    try{
        const descriptions = await Description.find();
        res.json(descriptions);
    }catch(err){
        console.error("Error getting all descriptions:", err);
        res.status(500).json({message: err.message});
    }
};

export const getDescriptionByID = async (req, res) => {
    await getDescription(req, res);
    if (!res.description)
        return res;
    res.json(res.description);
};

export const createDescription = async (req, res) => {
    try{
        const {product_id, description} = req.body;

        if(!mongoose.Types.ObjectId.isValid(product_id)){
            return res.status(400).json({ message: "Invalid product_id ObjectId format" });
        }

        if (!product_id || !description){
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        const newDescription = new Description({product_id, description});
        const save = await newDescription.save();
        res.status(201).json(save);
    }catch(err){
        console.error("Error creating description:", err);
        res.status(500).json({message: err.message});
    }
};

export const updateDescription = async (req, res) => {
    const {product_id, description} = req.body;
    try{
        await getDescription(req, res);
        if (!res.description)
            return res;

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({ message: "Invalid ObjectId format" });
        }else if(!mongoose.Types.ObjectId.isValid(product_id)){
            return res.status(400).json({ message: "Invalid product_id ObjectId format" });
        }

        if (product_id) res.description.product_id = product_id;
        if (description) res.description.description = description;

        const updated = await Description.findByIdAndUpdate(req.params.id, res.description, {new: true});
        res.json(updated);
    }catch(err){
        console.error("Error updating description:", err);
        res.status(500).json({message: err.message});
    }
}

export const deleteDescription = async (req, res) => {
    try{
        await getDescription(req, res);
        if(!res.description)
            return res;
        
        const deleted = await Description.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(500).json({message: "Failed to delete description"});

        res.json({message: "Deleted description"});
    }catch(err){
        console.error("Error deleting description:", err);
        res.status(500).json({message: err.message});
    }
}

async function getDescription(req, res){
    let description;
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({ message: "Invalid ObjectId format" });
        }

        description = await Description.findById(req.params.id);
        if (!description){
            return res.status(500).json({message: "Can't find description"});
        }
    }catch(err){
        console.error("Error getting description by ID:", err);
        return res.status(500).json({message: err.message});
    }
    res.description = description;
}