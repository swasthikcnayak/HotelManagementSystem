import express from "express";
import AccountController from "../controller/AccountController";
import emailAddress from "../validators/EmailValidator";
import password from "../validators/PasswordValidator";
import phoneNumber from "../validators/PhoneNumberValidator";
import validate from "../middleware/ValidationMiddleware";

const router = express.Router();

const accountController = new AccountController();

router.post(
  "/register",
  validate([
    emailAddress("email"),
    phoneNumber("phoneNumber", "en-IN"),
    password("password"),
  ]),
  (req, res, next) => {
    accountController.register(req, res, next);
  }
);

router.patch("/verify", (req, res, next) => {
  accountController.verifyAccount(req, res, next);
});

router.delete("/delete-account", (req, res) => {
  accountController.deleteAccount(req, res);
});

export default router;
