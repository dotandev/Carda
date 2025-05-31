import express, { Application, Express } from "express";
import cors from "cors";
import morgan from "morgan";
import { Database } from "./utils";
import { config } from "./config";
import { bookRouter, genreRouter, userRouter, authorRouter, authBookRouter, authorAuthRouter, genreAuthRouter } from "./routers";


const database = new Database();

let uri = process.env.MONGO_URI as string;

const {
    connectMongo
} = database;


const app: Application = express();
const PORT = process.env.PORT || 9999;



app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app
    .use("/api/books", bookRouter)
    .use("/api/books", authBookRouter.router)
    .use("/api/users", userRouter.router)
    .use("/api/authors", authorRouter)
    .use("/api/authors", authorAuthRouter.router)
    .use("/api/genres", genreRouter)
    .use("/api/genres", genreAuthRouter.router)




app.get("/", (req, res) => {
    res.send("Welcome to the Bookies API");
});

(async () => {
    try {
        await connectMongo(uri);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
})();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
