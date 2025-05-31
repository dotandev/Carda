import express, { Application, Express } from "express";
import cors from "cors";
import morgan from "morgan";
import { Database } from "./utils";
import { config } from "./config";
import { recordAuthRouter, userRouter } from "./routers";


const database = new Database();

let uri = process.env.MONGO_URI as string || "mongodb+srv://card:card@cluster0.rwrjqhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    .use("/api", userRouter)
    .use("/api", recordAuthRouter.router)
    




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
