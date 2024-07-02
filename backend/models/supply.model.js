import mongoose, { Schema } from "mongoose";

const SupplySchema=new Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      bottleType: {
        type: String,
        required: true,
      },
      price:{
        type:Number,
        default:null,
        required:true
      }

},{timestamps:true})

export default mongoose.model("supply",SupplySchema)

  