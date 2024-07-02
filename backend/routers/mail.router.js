import express from "express"
import { sendMail } from "../controllers/mail.controller"


const router = express.Router()

router.post("/send-invoice",sendMail)

export default router