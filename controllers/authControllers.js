import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { User } from "../db/user.js"
import HttpError from "../helpers/HttpError.js"

dotenv.config();
const { SEKRET_KEY } = process.env;

export const register = async (req, res, next) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
    throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10)
        
    const newUser = await User.create({...req.body, password: hashPassword});
    res.status(201).json({
    user: {
    email: newUser.email,
    subscription: "starter",
  }
});
    } catch (error) {
       next(error)
    }
};

export const login = async (req, res, next) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
    throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
    }
    
    const paylod = {
        id: user._id,
    }
    const token = jwt.sign(paylod, SEKRET_KEY, {expiresIn: '23h'})
        // const newUser = await User.create({...req.body, password: hashPassword});
    await User.findByIdAndUpdate(user._id, { token });

    res.status(201).json({token, user: {
    email: user.email,
    subscription: "starter",
  }});
    } catch (error) {
       next(error)
    }
};


export const getCurrent = (req, res, next) => {
    try {
        const { email, subscription } = req.user;
        res.status(201).json({ email, subscription })
    } catch (error) {
       next(error)
    }
};

export const logout = async(req, res, next) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, {token: null})
        res.status(204).json()
    } catch (error) {
       next(error)
    }
};