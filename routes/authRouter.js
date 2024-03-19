import express from "express";
import multer from 'multer';
import path from "path";

import validateBody from "../helpers/validateBody.js"
import {authenticate} from "../helpers/authenticate.js"
import { registerSchema, loginSchema } from "../schemas/usersSchemas.js"
import {
  register, login, getCurrent, logout
} from "../controllers/authControllers.js";

const authRouter = express.Router();

const tempDir = path.join(process.cwd(), "temp");
// console.log('tempDir :>> ', tempDir);

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})

const upload = multer({
  storage: multerConfig, 
})

authRouter.post("/register", upload.single("avatar"), validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login)

authRouter.get("/current", authenticate, getCurrent)

authRouter.post("/logout",authenticate, logout)

export default authRouter;