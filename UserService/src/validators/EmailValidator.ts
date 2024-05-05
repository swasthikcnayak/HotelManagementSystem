import { body } from "express-validator";

const emailAddress = (field: string) => {
  return body(field)
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .withMessage("Email address is required")
    .bail()
    .isLength({
      min: 3,
      max: 100,
    })
    .withMessage("Email address must be between 3 and 100 characters")
    .bail()
    .isEmail()
    .withMessage("Email address is not valid")
    .customSanitizer((email) => {
      return email.toLowerCase();
    });
};

export default emailAddress;
