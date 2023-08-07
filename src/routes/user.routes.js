import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { loginSchema, registerSchema } from "../schemas/user.schema.js";
import { signin, signup } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post('/signup', validateSchema(registerSchema), signup);
userRouter.post('/signin', validateSchema(loginSchema), signin)


export default userRouter;