import { body, query } from "express-validator";
import { MUNICIPALITY_EDITABLE_FIELDS } from "../models/Municipality.js";

const phonePattern = /^[0-9+()\-.\s]{7,32}$/;
const codePattern = /^[A-Za-z0-9_-]+$/;

export const municipalityCreateAllowedFields = [
  "code",
  "name",
  "province",
  "region",
  "officialEmail",
  "officialContactNumber",
  "officeAddress",
  "logoUrl",
  "status",
];

export const municipalityUpdateAllowedFields = MUNICIPALITY_EDITABLE_FIELDS;

export const municipalityListValidators = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100").toInt(),
  query("search").optional().trim().isLength({ max: 120 }).withMessage("Search is too long"),
  query("status").optional().isIn(["active", "inactive"]).withMessage("Status filter is invalid"),
  query("sort")
    .optional()
    .isIn(["createdAt", "-createdAt", "name", "-name", "province", "-province", "status", "-status"])
    .withMessage("Sort field is invalid"),
];

export const createMunicipalityValidators = [
  body("code")
    .trim()
    .matches(codePattern)
    .withMessage("Code may only contain letters, numbers, underscores, and hyphens")
    .isLength({ min: 2, max: 32 })
    .withMessage("Code must be 2 to 32 characters")
    .toUpperCase(),
  body("name").trim().isLength({ min: 2, max: 140 }).withMessage("Municipality name is required"),
  body("province").trim().isLength({ min: 2, max: 140 }).withMessage("Province is required"),
  body("region").trim().isLength({ min: 2, max: 140 }).withMessage("Region is required"),
  body("officialEmail").isEmail().withMessage("Official email must be valid").normalizeEmail(),
  body("officialContactNumber").trim().matches(phonePattern).withMessage("Official contact number must be valid"),
  body("officeAddress").trim().isLength({ min: 2, max: 280 }).withMessage("Office address is required"),
  body("logoUrl").optional({ values: "falsy" }).trim().isURL({ require_protocol: true }).withMessage("Logo URL must be valid"),
  body("status").optional().isIn(["active", "inactive"]).withMessage("Status is invalid"),
];

export const updateMunicipalityValidators = [
  body("officialEmail").optional().isEmail().withMessage("Official email must be valid").normalizeEmail(),
  body("officialContactNumber").optional().trim().matches(phonePattern).withMessage("Official contact number must be valid"),
  body("officeAddress").optional().trim().isLength({ min: 2, max: 280 }).withMessage("Office address is required"),
  body("logoUrl").optional({ values: "falsy" }).trim().isURL({ require_protocol: true }).withMessage("Logo URL must be valid"),
  body("status").optional().isIn(["active", "inactive"]).withMessage("Status is invalid"),
];

export const assignMunicipalAdminAllowedFields = ["email", "firstName", "lastName", "phone", "password", "passwordConfirm"];

export const assignMunicipalAdminValidators = [
  body("email").isEmail().withMessage("Email must be valid").normalizeEmail(),
  body("firstName").trim().isLength({ min: 1, max: 80 }).withMessage("First name is required"),
  body("lastName").trim().isLength({ min: 1, max: 80 }).withMessage("Last name is required"),
  body("phone").optional({ values: "falsy" }).trim().matches(phonePattern).withMessage("Phone number must be valid"),
  body("password")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/)
    .withMessage("Password must be at least 12 characters and include uppercase, lowercase, number, and symbol"),
  body("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match");
    }

    return true;
  }),
];
