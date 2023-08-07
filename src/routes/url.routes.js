import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { urlSchema } from "../schemas/url.schema.js";
import { deleteUrl, getUrl, shortUrl, shorten } from "../controllers/url.controller.js";
import { validateAuth } from "../middlewares/validateAuth.js";

const urlRouter = Router();

urlRouter.post('/urls/shorten', validateAuth, validateSchema(urlSchema), shorten);
urlRouter.get('/urls/:id', getUrl);
urlRouter.get('/urls/open/:shortUrl', shortUrl);
urlRouter.delete('/urls/:id', validateAuth, deleteUrl)

export default urlRouter;