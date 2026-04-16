import express from "express";
import {
  addNewsFeed,
  browseNewsFeeds,
  deleteNewsFeed,
  editNewsFeed,
  readNewsFeed,
} from "../controllers/newsFeedController.js";

const router = express.Router();

router.get("/", browseNewsFeeds);
router.get("/:id", readNewsFeed);
router.post("/", addNewsFeed);
router.put("/:id", editNewsFeed);
router.delete("/:id", deleteNewsFeed);

export default router;
