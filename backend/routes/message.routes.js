import express from "express";
import { sendMessage } from "../controllers/message.controller.js";
import protectRouter from "../middleware/protectRoute.js";

const router = express.Router();
router.post("/send/:id", protectRouter, sendMessage);

export default router;
