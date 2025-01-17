import express from "express";
import { addSupply, deleteByClientId, deleteSupply, getSupplies, getSuppliesForClient, getSupply, updateSupply } from "../controllers/supply.controllers";

const router=express.Router()


router.post("/add-supply",addSupply)
router.get("/get-supplies",getSupplies)
router.get("/client-supplies/:clientId",getSuppliesForClient)
router.get("/get-supplies/:supplyId",getSupply)
router.put("/update-supply/:supplyId",updateSupply)
router.delete("/delete-supply/:supplyId", deleteSupply)
router.delete("/delete-by-client/:clientId", deleteByClientId)

export default router