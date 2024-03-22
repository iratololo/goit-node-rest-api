import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import { User } from "../db/user.js"
import HttpError from "../helpers/HttpError.js"
import {sendEmail} from "../helpers/sendEmail.js"

dotenv.config();
const { SEKRET_KEY, BASE_URL } = process.env;

const avatarDir = path.join(process.cwd(), "public", "avatars");

export const register = async (req, res, next) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
    throw HttpError(409, "Email in use");
    }
        const hashPassword = await bcrypt.hash(password, 10);
        const avatarURL = gravatar.url(email);
        const verificationCode = nanoid();
        const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL: avatarURL, verificationToken: verificationCode });
        
        const verifyEmail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click verify email</a>`
        }
        sendEmail(verifyEmail);
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

export const verifyEmail = async(req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });
        if (!user) {
           throw HttpError(404, "User not found"); 
        }
       
        await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null})
        res.status(200).json({message: 'Verification successful'})
    } catch (error) {
       next(error)
    }
};

export const resendVerifyEmail = async(req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
           throw HttpError(404, "Not Found"); 
        }
        if (user.verify) {
           throw HttpError(400, "Verification has already been passed"); 
        }
        const verifyEmail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`
        }
        sendEmail(verifyEmail);
        
        res.status(200).json({"message": "Verification email sent"})
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
        
    if (!user.verify) {
    throw HttpError(401, "Email not verified");  
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
    }
    
    const paylod = {
        id: user._id,
    }
    const token = jwt.sign(paylod, SEKRET_KEY, { expiresIn: '23h' })
        
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({token, user: {
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
        res.status(200).json({ email, subscription })
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

export const updateAvatar = async(req, res, next) => {
    try {
        const { _id } = req.user;
        const { path: tempUpload, originalname } = req.file;
        const img = await Jimp.read(tempUpload);
        await img
        .autocrop()
        .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
        .writeAsync(tempUpload);
        const filename = `${_id}_${originalname}`;
        const resultUpload = path.join(avatarDir, filename);
        await fs.rename(tempUpload, resultUpload);
        const avatarURL = path.join("avatars", filename)
        await User.findByIdAndUpdate(_id, { avatarURL: avatarURL });
        res.status(200).json({avatarURL})
    } catch (error) {
       next(error)
    }
};