import express from "express";
import { addClient, deleteClient, getClient, getClients, updateClient } from "../controllers/client.controller";

const router = express.Router();


router.post("/add-client",addClient)
router.get("/get-clients",getClients)
router.get("/get-clients/:clientId",getClient)
router.put("/update-client/:clientId",updateClient)
router.delete("/delete-client/:clientId",deleteClient)

export default router;
