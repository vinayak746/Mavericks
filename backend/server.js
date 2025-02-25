import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";

// App config

const app = express();

const PORT = process.env.PORT || 8080;
connectDB()
connectCloudinary()

// middlewares

app.use(express.json());
app.use(cors())

// api endpoints
app.use("/api/users",userRouter)
app.use("/api/products",productRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(PORT,()=>console.log("Server Started on Port :" + PORT))