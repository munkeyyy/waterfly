import {
  addInvoice,
  generateMonthlyInvoice,
} from "../middleware/invoice.middleware";
import invoiceModel from "../models/invoice.model";

export const newInvoice = async (req, res) => {
  try {
    const { clientId, supplies } = req.body;
    const invoice = await addInvoice(clientId, supplies);
    if (invoice) {
      return res.status(201).json({
        data: invoice,
        message: "invoice generated successfully",
      });
    }
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

export const generateMonthlyInvoiceForClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { month, year } = req.query;

    const invoice = await generateMonthlyInvoice(clientId, month, year);
      console.log(invoice)
    return res.status(201).json({
      data: invoice,
      message: "Monthly invoice generated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await invoiceModel.find().populate("clientId supplies");
    if (invoices) {
      return res.status(200).json({
        data: invoices,
        message: "Invoices Fetched Successfully",
      });
    }

    return res.status(400).json({
      message: "Something went wrong",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;
    const invoices = await invoiceModel
      .findOne({ _id: invoiceId })
      .populate("clientId supplies");
    if (invoices) {
      return res.status(200).json({
        data: invoices,
        message: "Invoices Fetched Successfully",
      });
    }

    return res.status(400).json({
      message: "Something went wrong",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getInvoiceByClientId = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    console.log(clientId)
    const invoices = await invoiceModel
      .findOne({ clientId: clientId })
      .populate("clientId supplies");

    

    if (invoices) {
      return res.status(200).json({
        data: invoices,
        message: "Invoice Fetched Successfully",
      });
    }
console.log("inv",invoices)
    return res.status(400).json({
      message: "Something went wrong",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;
    const deletedInvoice = await invoiceModel.deleteOne({ _id: invoiceId });
    if (deletedInvoice.acknowledged) {
      return res.status(200).json({
        data: deletedInvoice,
        message: "deleted SuccessFully",
      });
    }
    return res.status(400).json({
      message: "something went wrong",
    });
  } catch (error) {
    return res.status(500).json({
        message:error.message
    })
  }
};
