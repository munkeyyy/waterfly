import express from "express"
import { deleteInvoice, generateMonthlyInvoiceForClient, getAllInvoices, getInvoice, getInvoiceByClientId, newInvoice } from "../controllers/invoice.controller"

const router=express.Router()

router.post("/add-invoice",newInvoice),
router.get("/get-all-invoices", getAllInvoices)
router.get("/get-invoice/:invoiceId",getInvoice)
router.get("/get-client-invoice/:clientId",getInvoiceByClientId)
router.post('/client/:clientId/invoice/generate-monthly', generateMonthlyInvoiceForClient);

router.delete("/delete-invoice/:invoiceId",deleteInvoice)

export default router