import express from "express";
import morgan from "morgan";
import cors from "cors";

import mongoose from 'mongoose';
mongoose.set('strictQuery', true);
const DB_HOST = "mongodb+srv://iratololo:ira19911@cluster0.nzgauxd.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(DB_HOST)
    .then(() => {app.listen(3000, () => {
  console.log("Database connection successfull");
})})
    .catch(error => {
        console.log(error.message);
        process.exit(1);
    })

import contactsRouter from "./routes/contactsRouter.js";

export const app = express();

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

// app.listen(3000, () => {
//   console.log("Server is running. Use our API on port: 3000");
// });