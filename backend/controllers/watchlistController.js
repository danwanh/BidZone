import Watchlist from "../models/watchlist.model";

// POST /api/watchlist
export const createWatchlist = async (req, res) => {
    try{
        const { user_id, product_id } = req.body;
        if (!user_id){
           return res.status(400).json( {message: "Missing required name"} ); 
        }
        
        const newWatchlist = await Watchlist( { user_id, product_id } );
        const savedWatchlist = await newWatchlist.save();

        res.status(201).json(savedWatchlist);
    }
    catch (error) {
        console.error("Error creating category: ", error);
        res.status(500).json( {message: "Server error"} );
    }
}