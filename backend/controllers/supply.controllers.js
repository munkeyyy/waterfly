import supplyModel from "../models/supply.model";

export const addSupply = (req, res) => {
  try {
    const { clientId, date, quantity, bottleType,price } = req.body;
    const supply = new supplyModel({
      clientId: clientId,
      date: date,
      quantity: quantity,
      bottleType: bottleType,
      price:price
    });
    supply.save();
    if (supply) {
      return res.status(201).json({
        data: supply,
        message: "supply created",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getSupplies = async (req, res) => {
  try {
    // const clienId=req.params.clientId
    const supplyData = await supplyModel.find().populate("clientId");
    const formatedSupply=supplyData.map((supply=>{
      const formatedDate=supply.date.toISOString().split('T')[0];
      return{
        ...supply._doc,
        date:formatedDate
      }
    }))
    // console.log("clients",formatedSupply.clientId)

    if (formatedSupply) {
      return res.status(200).json({
        data: formatedSupply,
        message: "supplies fetched successfully",
      });
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
export const getSuppliesForClient=async(req,res)=>{
  try {
    const clientId=req.params.clientId
    const supply=await supplyModel.find({clientId:clientId}).populate("clientId")
    const formatedSupply=supply.map((supply=>{
      const formatedDate=supply.date.toISOString().split('T')[0];
      return{
        ...supply._doc,
        date:formatedDate
      }
    }))

    if(formatedSupply){
      return res.status(200).json({
        data:formatedSupply,
        message:"fetched successfully"
      })
    }
    return res.status(400).json({
      message:"Something went wrong"
    })
  } catch (error) {
    
  }
}
export const getSupply = async (req, res) => {
  try {
    const supplyId = req.params.supplyId;
    const supplyData = await supplyModel.findOne({ _id: supplyId }).populate("clientId");
    if (supplyData) {
      return res.status(200).json({
        data: supplyData,
        message: "supply fetched successfully",
      });
    }
    return res.status(400).json({
      message: "something went wroong",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateSupply = async (req, res) => {
  try {
    const supplyId = req.params.supplyId;
    const { clientId, date, quantity, bottleType,price } = req.body;

    const updatedSupply = await supplyModel.updateOne(
      { _id: supplyId },
      {
        $set: {
          clientId: clientId,
          date: date,
          bottleType: bottleType,
          quantity: quantity,
          price:price
        },
      }
    );
    
    if (updatedSupply.acknowledged) {
      return res.status(200).json({
        data: updatedSupply,
        message: "supply updated successfully",
      });
    }
    return res.status(400).json({
      message: "something went wroong",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteSupply = async (req, res) => {
  try {
    const supplyId = req.params.supplyId;

    const deletedSupply = await supplyModel.deleteOne({ _id: supplyId });
    if (deletedSupply.acknowledged) {
      return res.status(200).json({
        data: deletedSupply,
        message: "supply deleted successfully",
      });
    }
    return res.status(400).json({
        message: "something went wroong",
      });
  } catch (error) {

    return res.status(500).json({
        message: error.message,
      });
  }
};
export const deleteByClientId = async (req, res) => {
  try {
    console.log(req.params.clientId)
    const clientId = req.params.clientId;
    console.log(`Attempting to delete supplies for client ID: ${clientId}`);
    const deletedSupply = await supplyModel.deleteMany({ clientId: clientId });
    console.log(`Deleted supplies: ${JSON.stringify(deletedSupply)}`);
    if (deletedSupply.acknowledged) {
      return res.status(200).json({
        data: deletedSupply,
        message: "supplies related to client deleted successfully",
      });
    }
    return res.status(400).json({
        message: "something went wroong",
      });
  } catch (error) {
    console.error(`Error deleting supplies for client ID: ${clientId} - ${error.message}`);
    return res.status(500).json({
        message: error.message,
      });
  }
};

