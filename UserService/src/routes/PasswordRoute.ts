import express from "express";
import PasswordController from "../controller/PasswordController";
import validate from "../middleware/ValidationMiddleware";
import emailAddress from "../validators/EmailValidator";
import password from "../validators/PasswordValidator";
const router = express.Router();

const passwordController = new PasswordController();

router.post(
  "/forgot-password",
  validate([emailAddress("email")]),
  (req, res, next) => {
    passwordController.forgotPassword(req, res, next);
  }
);

router.post(
  "/reset-password/",
  validate([password("password")]),
  (req, res, next) => {
    passwordController.resetPassword(req, res, next);
  }
);

export default router;
