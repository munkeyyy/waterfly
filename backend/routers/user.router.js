import express from "express";
import {
  addUser,
  deleteUser,
  getSingleUser,
  getUser,
  getUsers,
  signIn,
  signUp,
  updateUser,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/add-user", addUser);
router.get("/get-users", getUsers);
router.get("/get-users/:user_id", getSingleUser);
router.put("/update-user/:user_id", updateUser);
router.delete("/delete-user/:user_id", deleteUser);

// Auth

router.post("/sign-up", signUp);
router.post('/sign-in',signIn)
export default router;
