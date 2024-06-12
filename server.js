import express from "express";
import dotenv from "dotenv";
import connectDatabase from './config/MongoDb.js'
import { errorHandler, notFound } from "./middleware/error.js";
import cors from "cors";
import path from 'path';
import ImportData from "./importData.js";
import userRouter from './routes/userRoutes.js'
import portfolioRouter from "./routes/portfolioRoutes.js";
import { fileURLToPath } from 'url';

dotenv.config();
connectDatabase();
const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//APIs
app.use("/api/import", ImportData);
app.use("/api/users", userRouter);
app.use("/api/portfolio", portfolioRouter);

//Error handler
app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res)=>{
    res.send("Api is running...");
});

const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`server runs on port ${PORT}`));
