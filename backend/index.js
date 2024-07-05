import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routers/user.router.js"
import clientRouter from "./routers/client.router.js"
import supplyRouter from "./routers/supply.router.js"
import invoiceRouter from "./routers/invoice.routre.js"
import emailRouter from "./routers/mail.router.js"
import reportRouter from "./routers/report.router.js"

const app =express()
app.use(express.json()); //body-parser (to read request body data)

app.use("/uploads", express.static("uploads"));
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://olx-clone-3op0stry4-munkeyyys-projects.vercel.app');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

const port = 8000;

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_PREFIX+ process.env.MONGO_PASS + process.env.MONGO_SUFFIX);
    console.log("DB Connected!");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}
connectToDatabase()
app.listen(port, () => {
    console.log("Server is running on port " + port);
  });

app.use("/users", userRouter);
app.use("/clients",clientRouter)
app.use("/supplies",supplyRouter)
app.use("/invoice",invoiceRouter)
app.use("/mail",emailRouter)
app.use("/report",reportRouter)