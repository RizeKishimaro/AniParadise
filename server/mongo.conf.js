import mongoose from "mongoose";
mongoose.connect("mongodb+srv://Rize:367317792Root@cluster0.alqc92x.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log("error")
})