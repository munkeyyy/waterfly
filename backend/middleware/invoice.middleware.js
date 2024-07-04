import supplyModel from "../models/supply.model";
import invoiceModel from "../models/invoice.model";
export const addInvoice = async (clientId, supplyIds) => {
  const supplies = await supplyModel.find({
    _id: { $in: supplyIds },
    clientId,
  });

  const totalAmount = supplies.reduce(
    (total, supply) => total + supply.quantity * supply.price,
    0
  );

  const invoice = new invoiceModel({
    clientId,
    supplies: supplies.map((supply) => supply._id),
    date: new Date(),
    totalAmount,
    status: "pending",
  });

  await invoice.save();
  return invoice;
};

export const getMonthlySuppliesForClient = async (clientId, month, year) => {
  // const date = new Date(2024,8 );
  const startDate = new Date(month); // month is 0-indexed
  const endDate = new Date(year); // last day of the month
  console.log("Start Date:", month);
  console.log("End Date:", year);
  const supplies = await supplyModel.find({
    clientId,
    date: {
      $gte: month,
      $lt: year,
    },
  });

  console.log("supplllyyyyy", supplies);

  return supplies;
};

export const generateMonthlyInvoice = async (clientId, month, year) => {
  const supplies = await getMonthlySuppliesForClient(clientId, month, year);




  console.log("supplies", supplies);
  if (supplies.length === 0) {
    throw new Error(`No supplies found`);
  }

  const totalAmount = supplies.reduce(
    (total, supply) => total + supply.quantity * supply.price,
    0
  );

  const invoice = new invoiceModel({
    clientId,
    supplies: supplies.map((supply) => supply._id),
    date: new Date(),
    totalAmount,
    status: "pending",
  });

  await invoice.save();

  console.log("imb", invoice);
  return invoice;
};
