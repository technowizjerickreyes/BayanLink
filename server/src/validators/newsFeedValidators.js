import { body, query } from "express-validator";
import { NEWS_AUDIENCE_SCOPES, NEWS_CATEGORIES, NEWS_STATUSES } from "../models/NewsFeed.js";

export const newsFeedCreateAllowedFields = ["title", "content", "imageUrl", "audienceScope", "status", "category", "isPinned"];
export const newsFeedUpdateAllowedFields = ["title", "content", "imageUrl", "status", "category", "isPinned"];

export const newsFeedListValidators = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100").toInt(),
  query("status").optional().isIn(NEWS_STATUSES).withMessage("Status filter is invalid"),
  query("audienceScope").optional().isIn(NEWS_AUDIENCE_SCOPES).withMessage("Audience scope filter is invalid"),
  query("category").optional().isIn(NEWS_CATEGORIES).withMessage("Category filter is invalid"),
  query("dateFrom").optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Start date must be in YYYY-MM-DD format"),
  query("dateTo").optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("End date must be in YYYY-MM-DD format"),
  query("search").optional().trim().isLength({ max: 120 }).withMessage("Search is too long"),
];

export const createNewsFeedValidators = [
  body("title").trim().isLength({ min: 3, max: 180 }).withMessage("Title must be 3 to 180 characters"),
  body("content").trim().isLength({ min: 3, max: 12000 }).withMessage("Content must be 3 to 12000 characters"),
  body("imageUrl").optional({ values: "falsy" }).trim().isURL({ require_protocol: true }).withMessage("Image URL must be valid"),
  body("audienceScope").optional().isIn(NEWS_AUDIENCE_SCOPES).withMessage("Audience scope is invalid"),
  body("status").optional().isIn(NEWS_STATUSES).withMessage("Status is invalid"),
  body("category").optional().isIn(NEWS_CATEGORIES).withMessage("Category is invalid"),
  body("isPinned").optional().isBoolean().withMessage("Pinned value must be true or false").toBoolean(),
];

export const updateNewsFeedValidators = [
  body("title").optional().trim().isLength({ min: 3, max: 180 }).withMessage("Title must be 3 to 180 characters"),
  body("content").optional().trim().isLength({ min: 3, max: 12000 }).withMessage("Content must be 3 to 12000 characters"),
  body("imageUrl").optional({ values: "falsy" }).trim().isURL({ require_protocol: true }).withMessage("Image URL must be valid"),
  body("status").optional().isIn(NEWS_STATUSES).withMessage("Status is invalid"),
  body("category").optional().isIn(NEWS_CATEGORIES).withMessage("Category is invalid"),
  body("isPinned").optional().isBoolean().withMessage("Pinned value must be true or false").toBoolean(),
];
