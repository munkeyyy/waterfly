import UserModel from "../models/user.model";

import fs, { existsSync, unlinkSync } from "fs";
import userModel from "../models/user.model";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (fs.existsSync("./uploads/users")) {
        cb(null, "./uploads/users");
      } else {
        fs.mkdirSync("./uploads/users");
        cb(null, "./uploads/users");
      }
    },
    filename: function (req, file, cb) {
      console.log(file);
      const orgname = file.originalname;
      const name = path.parse(orgname).name;
      const ext = path.parse(orgname).ext;
      const unique = Date.now();
  
      const finalname = name + "-" + unique + ext;
  
      cb(null, finalname);
    },
  });
  const upload = multer({ storage: storage })
export const addUser = (req, res) => {
  try {
    const dataWithImage = upload.single("avatar");
    dataWithImage(req, res, function (err) {
      if (err)
        return res.status(400).json({
          message: err.message,
        });
      let img = null;
      if (req.file) {
        img = req.file.filename;
      }
      const { user_name, email, password, phone } = req.body;
      const userData = new UserModel({
        user_name: user_name,
        email: email,
        password: password,
        phone: phone,
        avatar: img,
      });
      userData.save();
      if (userData) {
        return res.status(201).json({
          data: userData,
          message: "user created successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const usersData = await UserModel.find();
    if (usersData) {
      return res.status(200).json({
        data: usersData,
        message: "users fecthed successfully!",
        // filepath: "https://waterfly.onrender.com/uploads/",
      });
    }
    return res.status(400).json({
      message: "something went wrong",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleUser = async (req, res) => {
    try {
        const userId = req.params.user_id
      const usersData = await UserModel.findOne({_id:userId});
      if (usersData) {
        return res.status(200).json({
          data: usersData,
          message: "users fecthed successfully!",
          // filepath: "https://waterfly.onrender.com/uploads/users/",
        });
      }
      return res.status(400).json({
        message: "something went wrong",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };

export const updateUser = async (req, res) => {
  try {
    const dataWithImage = upload.single("avatar");
    dataWithImage(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      console.log('mydata',req.file);
      console.log('yourdata',req.body);

      const userId = req.params.user_id;
      const existData = await UserModel.findOne({ _id: userId });
      console.log("data",existData.avatar)
      const { user_name, email, password, phone } = req.body;
      let image = existData.avatar;
        console.log("EXIST", image)
      if (req.file) {
        image = req.file.filename;
        if (fs.existsSync("./uploads/users/" + existData.avatar)) {
          fs.unlinkSync("./uploads/users/" + existData.avatar);
        }
        console.log("img",image)
      }
      console.log(image)

      const updatedUser = await UserModel.updateOne(
        { _id: userId },
        {
          $set: {
            user_name: user_name,
            email: email,
            password: password,
            phone: phone,
            avatar: image,
          },
        }
      );
      console.log("avatar",updatedUser)
      if (updatedUser.acknowledged) {
        console.log(updatedUser.avatar)
        return res.status(200).json({
          data: updatedUser,
          message: "user updated successfully",
        });
      }
      return res.status(400).json({
        message: "something went wrong",
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const existData = await UserModel.find({ _id: userId });

    const deletedUser = await UserModel.deleteOne({ _id: userId });
    if (deletedUser.acknowledged) {
      if (fs.existsSync("./uploads/users/" + existData.avatar)) {
        fs.unlinkSync("./uploads/users/" + existData.avatar);
      }
      return res.status(200).json({
        message: "user deleted successfully",
      });
    }
    return res.status(400).json({
      message: "something went wrong",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const signUp = async(req, res) => {
  try {
    const { user_name, email, password, phone } = req.body;
    const existUser = await UserModel.findOne({ email: email });
    if (existUser) {
      return res.status(200).json({
        message: "User Already Exists!",
      });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    return  UserModel.create({
      user_name: user_name,
      email: email,
      password: hashedPassword,
      phone: phone,
    })
      .then((data) => {
        return res.status(200).json({
          data: data,
          message: "User Signed Up Successfully!",
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: err,
        });
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await UserModel.findOne({ email: email });
    if (!existUser) {
      return res.status(400).json({
        message: "User dosen't Exist",
      });
    }
    const checkPassword = bcrypt.compareSync(password, existUser.password);
    if (!checkPassword) {
      return res.status(400).json({
        message:"Invalid Credentials"
      })}
      const token = jwt.sign(
        {
          _id: existUser._id,
          email: existUser.email,
          user_name: existUser.user_name,
        },
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: "1h" }
      );
      // console.log(token)
    //   console.log(req.user)
      return res.status(200).json({
       data: existUser,
       token: token,
       message:"User Signed in Successfully!!"
      })
    
  } catch (error) {
    return res.status(500).json({
      message:error.message
    })
  }
};


// export const resetPassword=async(req, res)=>{
//   const { oldPassword, newPassword } = req.body;
//   const userId= req.params.user_id
//   const user = await UserModel.findById(userId);

//   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

//   if (!isPasswordCorrect) {
//     return res.status(400).json({ message: "Invalid old password" });
//   }

//   user.password = newPassword;
//   await user.save({ validateBeforeSave: false });

//   return res.status(200).json({ message: "Password changed successfully" });
// }
