import { body } from "express-validator";
import { MobilePhoneLocale } from "express-validator/src/options";

const phoneNumber = (field: string, locale: MobilePhoneLocale) => {
  return body(field)
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .withMessage("Phone Number is required")
    .bail()
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage("Phone number must be 10 numbers")
    .bail()
    .isMobilePhone(locale)
    .withMessage("Invalid phone number");
};

export default phoneNumber;
