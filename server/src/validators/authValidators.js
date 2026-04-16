import { body } from "express-validator";

const phonePattern = /^[0-9+()\-.\s]{7,32}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/;

export const registerAllowedFields = [
  "email",
  "password",
  "passwordConfirm",
  "firstName",
  "lastName",
  "phone",
  "municipalityId",
  "barangayId",
];

export const loginAllowedFields = ["email", "password"];

export const citizenRegisterValidators = [
  body("email").isEmail().withMessage("Email must be valid").normalizeEmail(),
  body("password")
    .matches(passwordPattern)
    .withMessage("Password must be at least 12 characters and include uppercase, lowercase, number, and symbol"),
  body("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match");
    }

    return true;
  }),
  body("firstName").trim().isLength({ min: 1, max: 80 }).withMessage("First name is required"),
  body("lastName").trim().isLength({ min: 1, max: 80 }).withMessage("Last name is required"),
  body("phone").optional({ values: "falsy" }).trim().matches(phonePattern).withMessage("Phone number must be valid"),
  body("municipalityId").isMongoId().withMessage("Municipality is required"),
  body("barangayId").trim().isLength({ min: 1, max: 80 }).withMessage("Barangay is required"),
];

export const loginValidators = [
  body("email").isEmail().withMessage("Invalid credentials").normalizeEmail(),
  body("password").isString().isLength({ min: 1 }).withMessage("Invalid credentials"),
];
