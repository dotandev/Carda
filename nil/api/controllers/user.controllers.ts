import { Request, Response } from "express";
import { IUser } from "../types";
import { CustomError, CustomSuccess } from "../middlewares";
import { Users } from "../models";
import { Hasher, JWTController } from "../utils";

const hasher = new Hasher('secretkhwahelj;42fe30ucehbj3ug3g3cgcvycy73crygcyg8c9cxBKXCBII328');
const jwtController = new JWTController();

export class UserController {
    public async CreateUser(req: Request, res: Response) {
        try {
            const { email, password, username, firstName, lastName } = req.body as IUser;
            console.log(req.body);
            const existingUser = await Users.findOne({ email });
            console.log(existingUser);
            if (existingUser) {
                throw new CustomError(400, "User already exists").sendResponse(res);
            }
            const isUsernameTaken = await Users.findOne({ username });
            console.log(isUsernameTaken);
            if (isUsernameTaken && isUsernameTaken.username === username) {
                throw new CustomError(400, "Username already taken").sendResponse(res);
            }
            console.log("hashing password");
            const hashedPassword = hasher.hashPassword(password);
            console.log(hashedPassword);
            const newUser = new Users({
                firstName,
                lastName,
                email,
                username,
                password: hashedPassword,
            });
            console.log("saving user");
            await newUser.save();
            console.log("user saved");
            const data = {
                userId: newUser._id,
                email: newUser.email,
            }
            throw new CustomSuccess(201, "User created successfully", data).sendResponse(res);
        } catch (error) {
            throw new CustomError(500, "Internal Server Error").sendResponse(res);
        }
    }

    public async LoginUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body as IUser;
            const user = await Users.findOne({ email });
            if (!user) {
                throw new CustomError(401, "Invalid credentials").sendResponse(res);
            }
            const isPasswordValid = hasher.verifyPassword(
                password,
                user.password
            );
            if (!isPasswordValid) {
                throw new CustomError(401, "Invalid credentials").sendResponse(res);
            }
            console.log("password verified");
            const token = jwtController.signAccessToken({
                userId: user._id as string,
                email: user.email,
            });
            throw new CustomSuccess(200, "Login successful", { token }).sendResponse(res);
        } catch (error) {
            throw new CustomError(500, "Internal Server Error").sendResponse(res);
        }
    }
}
