import jwt from "jsonwebtoken";
import userModel from "../models/user.model";
const auth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;

      let decodeToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
      if (decodeToken) {
        const user = await userModel.findById(decodeToken._id);
        
        // Attach user details to req.user
        req.user = user;

        next();
      } else {
        return res.status(401).json({
          message: "Invalid token",
        });
      }
    } else {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default auth;
