import express from "express";
import { addReport, clientReport, getMonthlyReport } from "../controllers/report.controller";

const router = express.Router();



router.get("/download-report",clientReport)
router.post("/add-report", addReport)
router.get("/get-monthly-report",getMonthlyReport)





export default router


