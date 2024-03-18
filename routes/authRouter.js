import express from "express";

import validateBody from "../helpers/validateBody.js"
import {authenticate} from "../helpers/authenticate.js"
import { registerSchema, loginSchema } from "../schemas/usersSchemas.js"
import {
  register, login, getCurrent, logout
} from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login)

authRouter.get("/current", authenticate, getCurrent)

authRouter.post("/logout",authenticate, logout)

export default authRouter;