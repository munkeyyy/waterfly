import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({

    user_name:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
    },
    
    password:{
        type:String,
        required:true,
    },

    phone:{
        type:Number,
        default:null
    },

    avatar:{
        type:String,
        default:null
    },

    created_at:{
        type:Date,
        default:Date.now()
    }
    
})


// userSchema.methods.isPasswordCorrect = async function (password) {
//     return await bcrypt.compare(password, this.password);
//   };

export default mongoose.model("user", UserSchema)