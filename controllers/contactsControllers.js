import HttpError from "../helpers/HttpError.js"
import { Contact } from "../db/contact.js"

export const getAllContacts = async (req, res, next) => {
    try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({owner}, '-createdAt -updatedAt', {skip, limit}).populate("owner");
    res.status(200).json(result);
    } catch (error) {
       next(error)
    }
};

export const getOneContact = async (req, res,next) => {
    try {
        const result = await Contact.findById(req.params.id);
        if (!result) {
           throw HttpError(404, "Not found")
        }
    res.status(200).json(result);
    } catch (error) {
        next(error)
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const result = await Contact.findByIdAndDelete(req.params.id);
        if (!result) {
           throw HttpError(404, "Not found")
        }
        res.json(result); 
    } catch (error) {
        next(error)
    }
};

export const createContact = async (req, res, next) => {
    try {
        const { _id: owner } = req.user;
        const result = await Contact.create({...req.body, owner});
        res.status(201).json(result);
    } catch (error) {
        next(error)
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const result = await Contact.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if (!result) {
           throw HttpError(404, "Not found")
        }
        res.status(200).json(result);
    } catch (error) {
       next(error) 
    }
};

export const updateStatusContact = async (req, res, next) => {
    try {
        const result = await Contact.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if (!result) {
           throw HttpError(404, "Not found")
        }
        res.status(200).json(result);
    } catch (error) {
       next(error) 
    }
};