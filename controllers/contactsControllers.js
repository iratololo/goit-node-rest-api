import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js"

export const getAllContacts = async (req, res, next) => {
    try {
    const result = await contactsService.listContacts();
    res.status(200).json(result);
    } catch (error) {
       next(error)
    }
};

export const getOneContact = async (req, res,next) => {
    try {
        const result = await contactsService.getContactById(req.params.id);
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
        const result = await contactsService.removeContact(req.params.id);
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
        const result = await contactsService.addContact(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error)
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const result = await contactsService.updateContact(req.params.id, req.body);
        if (!result) {
           throw HttpError(404, "Not found")
        }
        res.status(200).json(result);
    } catch (error) {
       next(error) 
    }
};