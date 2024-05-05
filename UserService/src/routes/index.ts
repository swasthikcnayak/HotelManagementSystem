import express from "express";
const router = express.Router();

import accountRoute from "./AccountRoute";
import authRoute from "./AuthRoute";
import passwordRoute from "./PasswordRoute";
router.use("/account", accountRoute);
router.use("/auth", authRoute);
router.use("/password", passwordRoute);
export default router;
