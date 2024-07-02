import mongoose, {Schema } from "mongoose";

const ClientSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        // required:true
        default:null
    },
    location:{
        type:String,
        default:null
    },
    pincode:{
        type:Number,
        default:null
    }
})

export default mongoose.model("client", ClientSchema)