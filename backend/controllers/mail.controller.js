import generateInvoice from "../middleware/invoicePdf.middleware";
import sendInvoiceEmail from "../middleware/mail.middleware";
import clientModel from "../models/client.model";
import supplyModel from "../models/supply.model";
import fs from "fs";
import path from "path";

export const sendMail = async (req, res) => {
  try {
    const { clientId, email, month, year } = req.body;

    const client = await clientModel.findById(clientId);
    console.log("client:", client)
    const startDate = new Date(year, month - 1, 1);
    console.log("start:",startDate)
    const endDate = new Date(year, month, 0); // last day of the month
    console.log("end:",endDate)

    const supplies = await supplyModel.find({
      clientId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });
    console.log("client supplies",supplies)

    if (!client || supplies.length === 0) {
      return res.status(404).json({ message: "Client or supplies not found" });
    }

    const invoiceData = {
      clientName: client.name,
      clientId: clientId,
      date: new Date().toISOString().split("T")[0],
      totalAmount: supplies.reduce(
        (total, supply) => total + supply.quantity * supply.price,
        0
      ),
      items: supplies.map((supply) => ({
        date:supply.date,
        description: supply.bottleType,
        quantity: supply.quantity,
        price: supply.price,
        total: supply.quantity * supply.price,
      })),
    };

    const invoiceDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }
    
    const invoicePath = path.join(invoiceDir, `invoice_${clientId}_${year}_${month}.pdf`);
    await generateInvoice(invoiceData, invoicePath);
    await sendInvoiceEmail(email, invoicePath);

    res.status(200).json({ data: invoiceData, message: "Invoice sent successfully" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
