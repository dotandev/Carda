import { UserValidator } from "../validators/user.validator";
import { UserController } from "../controllers";
import { Authenticator, createValidatorMiddleware } from "../middlewares";
import { BookiesRouter } from "../types";

const authenticator = new Authenticator();
const userController = new UserController();
const userValidator = new UserValidator()
const userValidatorMiddleware = createValidatorMiddleware(userValidator)


export const userRouter = BookiesRouter();




const {
    CreateUser,
    LoginUser,
} = userController;

const {
    authenticate,
} = authenticator;

const {
    validateCreate,
} = userValidatorMiddleware

userRouter
    .post("/register", validateCreate(), CreateUser)
    .post("/login", LoginUser)


// ⁠POST /api/register (user registration)
// •⁠  ⁠POST /api/login (user login)



