import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { urlSchema } from "../schemas/url.schema.js";
import { shorten } from "../controllers/url.controller.js";
import { validateAuth } from "../middlewares/validateAuth.js";

const urlRouter = Router();

urlRouter.post('/urls/shorten', validateAuth, validateSchema(urlSchema), shorten);

export default urlRouter;