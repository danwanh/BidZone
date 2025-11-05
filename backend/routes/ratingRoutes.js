import express from "express";
import { 
    getAllRatings, 
    getRatingByID,
    createRating
} from "../controllers/ratingController.js";

const router = express.Router();


router.get("", getAllRatings);
router.get("/:id", getRatingByID);
router.post("/", createRating);



export default router;