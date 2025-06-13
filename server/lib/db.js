import mongoose from "mongoose";

// connect DB 

export const connectDB = async ()=>{
    try {
        mongoose.connection.on("connected",()=>{
            console.log("connected to DB")
        })
        await mongoose.connect(`${process.env.MONGODB_URI}`)
    } catch (error) {
        console.error(error);
    }
}