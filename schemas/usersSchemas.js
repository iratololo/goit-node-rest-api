import Joi from "joi";

import {emailRegexp} from "../db/user.js"

export const registerSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
})

export const emailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
})

export const updateAvatarSchema = Joi.object({
    avatarURL: Joi.string().required(),
})

export const loginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
})

