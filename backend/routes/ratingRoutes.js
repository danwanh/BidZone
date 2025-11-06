import express from "express";
import { 
    getAllRatings, 
    getRatingByID,
    createRating,
    updateRating,
    deleteRating
} from "../controllers/ratingController.js";

const router = express.Router();


router.get("", getAllRatings);
router.get("/:id", getRatingByID);
router.post("/", createRating);
router.patch("/:id", updateRating);
router.delete("/:id", deleteRating);



export default router;