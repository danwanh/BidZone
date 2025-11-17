import express from "express"
import{
    getAllDescriptions,
    getDescriptionByID,
    createDescription,
    updateDescription,
    deleteDescription
} from "../controllers/desController.js";

const router = express.Router();

router.get("/", getAllDescriptions);
router.get("/:id", getDescriptionByID);
router.post("/", createDescription);
router.patch("/:id", updateDescription);
router.delete("/:id", deleteDescription);

export default router;

