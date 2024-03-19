import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
})

export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string(),
    favorite: Joi.boolean(),
}).min(1).message("Body must have at least one field")

export const updateFavoriteSchemas = Joi.object({
    favorite: Joi.boolean().required(),
})