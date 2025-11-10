import Rating from "../models/rating.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getAllRatings = async (req, res) => {
    try{
        const ratings = await Rating.find();
        res.json(ratings);
    }catch(err){
        console.error("Error getting all ratings:", err);
        res.status(500).json({message: err.message});
    }
};

export const getRatingByID = async (req, res) => {
    await getRating(req, res);
    if (!res.rating)
        return res;
    res.json(res.rating);
};

export const createRating = async (req, res) => {
    try{
        const {product_id, from_user_id, to_user_id, comment, points} = req.body;

        if (!product_id || !from_user_id || !to_user_id || !comment){
            return res.status(400).json({ message: "Missing required fields" });
        }else if (points !== 1 && points !== -1){
            return res.status(400).json({ message: "Points must be either 1 or -1" });
        }else if (from_user_id === to_user_id){
            return res.status(400).json({ message: "User can't rate themself "});
        }
        
        const rating = new Rating({product_id, from_user_id, to_user_id, comment, points});
        const save = await rating.save();
        res.status(201).json(save);
    }catch(err){
        console.error("Error creating rating:", err);
        res.status(500).json({message: err.message});
    }
};

export const updateRating = async (req, res) => {
    const {product_id, from_user_id, to_user_id, comment, points} = req.body;
    try{
        await getRating(req, res);
        if (!res.rating)
            return res;

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({ message: "Invalid ObjectId format" });
        }
        // else if (from_user_id === to_user_id){
        //     return res.status(400).json({ message: "User can't rate themself "});
        // }else if (points !== 1 && points !== -1){
        //     return res.status(400).json({ message: "Points must be either 1 or -1" });
        // }
            
        // const rating = res.rating;
        // console.log(typeof rating);
        // if (product_id) rating.product_id = product_id;
        // if(from_user_id) rating.from_user_id = from_user_id;
        // if (to_user_id) rating.to_user_id = to_user_id;
        if (comment) res.rating.comment = comment;
        if (points) res.rating.points = points;
        const updated = await Rating.findByIdAndUpdate(req.params.id, res.rating, {new: true});

        res.json(updated);
    }catch(err){
        console.error("Error updating rating:", err);
        res.status(500).json({message: err.message});
    }
}

export const deleteRating = async (req, res) => {
    try{
        await getRating(req, res);
        if(!res.rating)
            return res;
        
        const deleted = await Rating.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(500).json({message: "Failed to delete rating"});

        res.json({message: "Deleted rating"});
    }catch(err){
        console.error("Error deleting rating:", err);
        res.status(500).json({message: err.message});
    }
}

async function getRating(req, res){
    let rating;
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({ message: "Invalid ObjectId format" });
        }

        rating = await Rating.findById(req.params.id);
        if (!rating){
            return res.status(500).json({message: "Can't find rating"});
        }
    }catch(err){
        console.error("Error getting rating by ID:", err);
        return res.status(500).json({message: err.message});
    }
    res.rating = rating;
}