import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { loginSchema, registerSchema } from "../schemas/user.schema.js";
import { aboutMe, signin, signup } from "../controllers/user.controller.js";
import { validateAuth } from "../middlewares/validateAuth.js";

const userRouter = Router();

userRouter.post('/signup', validateSchema(registerSchema), signup);
userRouter.post('/signin', validateSchema(loginSchema), signin);
userRouter.get('/users/me', validateAuth, aboutMe)


export default userRouter;