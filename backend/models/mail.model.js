import mongoose, { Schema } from "mongoose";
import { ref } from "pdfkit";

const MailSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"client",
        required:true
    }
},{timestamps:true})

export default mongoose.model("mail",MailSchema)