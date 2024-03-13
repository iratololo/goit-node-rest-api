import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';

import contactsRouter from "./routes/contactsRouter.js";

dotenv.config();

const { DB_HOST } = process.env;

mongoose.set('strictQuery', true);

const app = express();

mongoose.connect(DB_HOST)
    .then(() => {app.listen(3000, () => {
  console.log("Database connection successfull");
})})
    .catch(error => {
        console.log(error.message);
        process.exit(1);
    })

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});