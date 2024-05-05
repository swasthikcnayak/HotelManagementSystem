import express from "express";
import AuthController from "../controller/AuthController";
import { Verify } from "../middleware/authMiddleware";
import validate from "../middleware/ValidationMiddleware";
import emailAddress from "../validators/EmailValidator";
import password from "../validators/PasswordValidator";
const router = express.Router();

const authController = new AuthController();

router.post(
  "/login",
  validate([emailAddress("email"), password("password")]),
  (req, res, next) => {
    authController.login(req, res, next);
  }
);

router.post("/logout", Verify, (req, res, next) => {
  authController.logout(req, res, next);
});

export default router;
