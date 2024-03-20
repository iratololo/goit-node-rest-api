import HttpError from "../helpers/HttpError.js"
import { Contact } from "../db/contact.js"

export const getAllContacts = async (req, res, next) => {
    try {
        const { _id: owner} = req.user;
        const { page = 1, limit = 10, favorite} = req.query;
        const skip = (page - 1) * limit;
        const result = await Contact.find({ owner }, '-createdAt -updatedAt', { skip, limit }).populate("owner");

        const filter = await Contact.find({ owner, "favorite": favorite}, '-createdAt -updatedAt', { skip, limit }).populate("owner");
        if (filter.length > 0 && favorite) {
            res.status(200).json(filter);
        }
    res.status(200).json(result);
    } catch (error) {
       next(error)
    }
};

export const getOneContact = async (req, res,next) => {
    try {
        const { _id: id } = req.user;
        const result = await Contact.findById(req.params.id);
        if (!result) {
           throw HttpError(404, "Not found")
        }
        if (result.owner.toString() !== id.toString()) {
            throw HttpError(404, "Not found")
        }
    res.status(200).json(result);
    } catch (error) {
        next(error)
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { _id: id} = req.user;
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
           throw HttpError(404, "Not found")
        }
        if (contact.owner.toString() !== id.toString()) {
            throw HttpError(404, "Not found")
        }
        const result = await Contact.findByIdAndDelete(req.params.id);
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
        const { _id: id } = req.user;
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
           throw HttpError(404, "Not found")
        }
        if (contact.owner.toString() !== id.toString()) {
            throw HttpError(404, "Not found")
        }
        const result = await Contact.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(200).json(result);
    } catch (error) {
       next(error) 
    }
};

export const updateStatusContact = async (req, res, next) => {
    try {
        const { _id: id } = req.user;
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
           throw HttpError(404, "Not found")
        }
        if (contact.owner.toString() !== id.toString()) {
           throw HttpError(404, "Not found")
        }
        const result = await Contact.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(200).json(result);
    } catch (error) {
       next(error) 
    }
};