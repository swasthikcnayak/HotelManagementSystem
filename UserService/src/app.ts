import express from "express";
import route from "./routes/index";
import mongoose from "mongoose";
import cors from "cors";
import { errorHandler } from "./utils/ErrorHandler";

const mongoDBUrl =
  "mongodb+srv://user_1:Alpha123@cluster0.dndshsn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const PORT = 3000;

const app: express.Application = express();

mongoose.connect(mongoDBUrl);
const database = mongoose.connection;
database.on("error", (error) => {
  console.log(error);
});
database.once("connected", () => {
  console.log("Database Connected");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/user", route);

app.use(errorHandler);

app.listen(PORT, function () {
  console.log("Example app listening on port 3000!");
});
