import Rating from "../models/rating.model.js";

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
    try{

    }catch(err){
        console.error("Error getting rating by ID:", err);
        res.status(500).json({message: err.message});
    }
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
        
        const rating = new Rating(req.body);
        const save = await rating.save();
        res.status(201).json(save);
    }catch(err){
        console.error("Error creating rating:", err);
        res.status(500).json({message: err.message});
    }
};

export const updateRating = async (req, res) => {
    try{

    }catch(err){
        console.error("Error updating rating:", err);
        res.status(400).json({message: err.message});
    }
}

export const deleteRating = async (req, res) => {
    try{

    }catch(err){
        console.error("Error deleting rating:", err);
        res.status(500).json({message: err.message});
    }
}