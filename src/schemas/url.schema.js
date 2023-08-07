import Joi from "joi"

export const urlSchema = Joi.object({
    url: Joi.string().required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
});