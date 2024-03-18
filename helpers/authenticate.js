import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import HttpError from "../helpers/HttpError.js"
import { User } from "../db/user.js"

dotenv.config();
const { SEKRET_KEY } = process.env;

export const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        next(HttpError(401, "Not authorized"));
    }
    try {
        const { id } = jwt.verify(token, SEKRET_KEY);
        const user = await User.findById(id);
        if (!user || !user.token || user.token !== token) {
            next(HttpError(401, "Not authorized"));
        }
        req.user = user;
         next();
    } catch (error) {
         next(HttpError(401, "Not authorized"));
    }
}