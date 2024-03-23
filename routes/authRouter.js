import express from "express";

import validateBody from "../helpers/validateBody.js"
import {authenticate} from "../helpers/authenticate.js"
import { registerSchema, loginSchema, emailSchema, updateAvatarSchema } from "../schemas/usersSchemas.js"
import {
  register, login, getCurrent, logout, updateAvatar, verifyEmail, resendVerifyEmail
} from "../controllers/authControllers.js";
import {upload} from "../helpers/upload.js"

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.get("/verify/:verificationToken", verifyEmail);

authRouter.post("/verify",  validateBody(emailSchema), resendVerifyEmail);

authRouter.post("/login", validateBody(loginSchema), login)

authRouter.get("/current", authenticate, getCurrent)

authRouter.post("/logout", authenticate, logout)

authRouter.patch("/avatars", authenticate, validateBody(updateAvatarSchema), upload.single("avatar"), updateAvatar)


export default authRouter;