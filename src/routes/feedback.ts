import Router from "express";
import feedbackController from "../controllers/feedbackController";
const router = Router();

router.route("/getList").get(feedbackController.getFeedbacks);

router.route("").post(feedbackController.createFeedback);

export default router;
