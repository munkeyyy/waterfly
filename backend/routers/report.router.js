import express from "express";
import { clientReport, getMonthlyReport } from "../controllers/report.controller";

const router = express.Router();



router.get("/download-report",clientReport)
router.get("/get-monthly-report",getMonthlyReport)






export default router