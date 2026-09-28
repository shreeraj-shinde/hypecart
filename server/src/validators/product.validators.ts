import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Invalid data",
      errors: errors.array(),
    });
  }

  next();
};

export const createProductValidator = [
  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .isString()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage("Name must be between 1 and 120 characters"),
  body("category")
    .exists()
    .withMessage("Category is required")
    .bail()
    .isString()
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage("Category must be between 1 and 60 characters"),
  body("price")
    .exists()
    .withMessage("Price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a whole number greater than or equal to 0"),
  body("description").optional().isString().trim(),
  body("imageUrl").optional().isString().trim().isURL().withMessage("Image URL must be a valid URL"),
  handleValidation,
];

export const updateProductValidator = [
  body("name")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage("Name must be between 1 and 120 characters"),
  body("category")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage("Category must be between 1 and 60 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a whole number greater than or equal to 0"),
  body("description").optional().isString().trim(),
  body("imageUrl").optional().isString().trim().isURL().withMessage("Image URL must be a valid URL"),
  handleValidation,
];
