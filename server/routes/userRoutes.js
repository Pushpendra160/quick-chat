import express from "express";
import { checkAuth, login, Signup, updateProfile } from "../controllers/UserController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup",Signup);
userRouter.post("/login",login);
userRouter.get("/check",protectRoute, checkAuth);
userRouter.put("/update-profile", protectRoute, updateProfile);

export default userRouter;