import clientModel from "../models/client.model";

export const addClient = (req, res) => {
  try {
    const { name, email, phone, location, pincode } = req.body;
    const clientData = new clientModel({
      name: name,
      phone: phone,
      email: email,
      location: location,
      pincode: pincode,
    });
    clientData.save();
    if (clientData) {
      return res.status(201).json({
        data: clientData,
        message: "created successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
        message:error.message
    })
  }
};

export const getClients=async(req,res)=>{
    try {
        const getClientData=await clientModel.find()
        if(getClientData){
            return res.status(200).json({
                data:getClientData,
                message:"clients fetched succesfully"
            })
        }
        return res.status(400).json({
            message:"something went wrong"
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}
export const getClient=async(req,res)=>{
    try {
        const clientId=req.params.clientId
        const getClientData=await clientModel.findOne({_id:clientId})
        if(getClientData){
            return res.status(200).json({
                data:getClientData,
                message:"clients fetched succesfully"
            })
        }
        return res.status(400).json({
            message:"something went wrong"
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}
export const updateClient=async(req,res)=>{
    try {
    const { name, email, phone, location, pincode } = req.body;

        const clientId=req.params.clientId
        const updateClientData=await clientModel.updateOne({_id:clientId},{$set:{name,email,phone,location,pincode}})
        if(updateClientData.acknowledged){
            return res.status(200).json({
                data:updateClientData,
                message:"clients updated succesfully"
            })
        }
        return res.status(400).json({
            message:"something went wrong"
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

export const deleteClient=async(req,res)=>{
    try {
        const clientId=req.params.clientId
        const deleteClientData=await clientModel.deleteOne({_id:clientId})
        if(deleteClientData.acknowledged){
            return res.status(200).json({
                data:deleteClientData,
                message:"Client deleted successfully"
            })
        }
        return res.status(400).json({
            message:"something went wrong"

        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

