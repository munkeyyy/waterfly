import moment from "moment/moment";
import supplyModel from "../models/supply.model";
import exceljs from "exceljs";
import crypto from "crypto"
import reportModel from "../models/report.model";
export const clientReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const supplies = await supplyModel.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).populate("clientId");
      // const report= new reportModel({
      //   supplies:supplies.map((supply)=>supply)
      // })


    if (supplies.length === 0) {
      return res
        .status(400)
        .json({ message: "No supplies found for the given date range" });
    }
    // await report.save()
    

    const workbook = new exceljs.Workbook();
    const workSheet = workbook.addWorksheet("Monthly Report");

    workSheet.columns = [
      { header: "Date", key: "date", width: 20 },
      { header: "Client", key: "client", width: 20 },
      { header: "Bottles", key: "bottleType", width: 25 },
      { header: "Quantity", key: "quantity", width: 15 },
      { header: "Price", key: "price", width: 15 },
      { header: "Amount", key: "amount", width: 15 },
    ];

    // Make headers bold
    workSheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    supplies.forEach((supply) => {
      workSheet.addRow({
        date: moment(supply.date.toISOString().split("T")[0]).format("L"),
        client: supply.clientId.name,
        bottleType: supply.bottleType,
        quantity: supply.quantity,
        price: supply.price,
        amount: supply.quantity * supply.price,
      });
    });

    // Add total amount row
    const totalAmount = supplies.reduce(
      (total, supply) => total + supply.quantity * supply.price,
      0
    );
    workSheet.addRow({});
    workSheet.addRow({
      date: "",
      bottleType: "",
      quantity: "",
      price: "Total",
      amount: totalAmount,
    });

    // Make the total amount row bold
    const totalRow = workSheet.lastRow;
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report_of_${moment(startDate).format(
        "L"
      )}_to_${moment(endDate).format("L")}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const addReport=async(req,res)=>{
    try {
        const{startDate,endDate}=req.query
        const getSupplies = await supplyModel.find({
            date:{
                $gte:startDate,
                $lt:endDate
            }
        }).populate("clientId")
        const report = new reportModel({
            supplies:getSupplies.map((supply)=>supply._id)
        })

        await report.save()

        if(report){
            return res.status(201).json({
                data:report,
                message:"Report created succesfully",
            })
        }
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}
export const getMonthlyReport = async (req, res) => {
  try {
//     const { startDate, endDate } = req.query;
//     console.log("report start daye :", new Date(startDate));
//     console.log("report end daye :", new Date(endDate));
//     const supplies = await supplyModel.find({
//       date: {
//         $gte: startDate,
//         $lt: endDate,
//       },
//     }).populate("clientId");
//     console.log("Monthly report :", supplies);
// const date= Date.now()
// const id = crypto.randomBytes(16).toString("hex")
//     if (supplies) {
//       return res.status(200).json({
//         data: supplies,
//         message: "Monthly Report Fetched Successfully",
//         created_at:moment(date).format(),
//         _id:id
//       });
//     }
const {startDate,endDate}=req.query
let filter={}
if(startDate&&endDate){
filter={
  date:{
    $gte:startDate,
    $lt:endDate
  }
}
}
const report = await supplyModel.find(filter).populate("clientId")
if(report){
  return res.status(200).json({
    data:report,
    message:"report fetched successfully"
  })
}
    return res.status(400).json({
      message: "something went wrong",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
