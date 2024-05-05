import { body } from "express-validator";

const password = (field: string) => {
  return body(field)
    .trim()
    .escape()
    .isString()
    .isLength({ min: 8 })
    .withMessage(
      `${
        field === "password" ? "Password" : "Confirm password"
      } should not be empty and at a minimum eight characters.`
    )
    .bail()
    .custom((value, { req }) => {
      if (field === "confirmPassword" && value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    });
};

export default password;
