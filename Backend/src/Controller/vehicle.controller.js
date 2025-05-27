import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/apiError.js";
import { Vehicle } from "../Models/vehicle.model.js";
import { Campaign } from "../Models/campaign.model.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { sequelize } from "../DB/DbConfig.js";
import { Op, literal } from 'sequelize';


const registerVehical = asyncHandler(async (req, res) => {

  const { vin, modelName, modelYear, brandName } = req.body;

  if ([vin, modelYear, brandName, modelName].some((item) => item < 0)) {
    throw new ApiError(400, "Some required fields are missing");
  }

  const existedVehicle = await Vehicle.findOne({ where: { vin } });

  if (existedVehicle) {
    throw new ApiError(409, "vehicle with this VIN is already exists");
  }

  const vehicle = await Vehicle.create({
    vin,
    modelYear,
    modelName,
    brandName,
  });

  if (!vehicle) {
    throw new ApiError(500, "Something went wrong while registering vehicle")
  }
  return res
    .status(201)
    .json(new apiResponse(200, vehicle, "Vehicle registered successfully"));
});


const getVehicle = asyncHandler(async (req, res) => {
  const vehicleList = await Vehicle.findAll({
    where: { vehicleDelHistory: "Present" },
    order: [["createdAt", "DESC"]]
  });
  return res.status(200).json(new apiResponse(200, vehicleList, "Success"));
});

const getDeletedVehicle = asyncHandler(async (req, res) => {
  const vehicleList = await Vehicle.findAll({ where: { vehicleDelHistory: "Deleted" } });
  return res.status(200).json(new apiResponse(200, vehicleList, "Success"));
})


const deleteVehicle = asyncHandler(async (req, res) => {
  const { vin } = req.body;
  console.log("Vehicle to Delete", vin);
  if (!vin) {
    throw new ApiError(400, "VIN is mandatory to delete the item");
  }

  // const campaign = await Campaign.findOne({
  //   where: sequelize.literal(
  //     `JSON_CONTAINS(vehicle, '["${vin}"]') = 1`  // MySQL's JSON_CONTAINS function
  //   ),
  //   and: {
  //     status: "Client Not Connect",
  //   },
  // });

  const campaign = await Campaign.findOne({
    where: {
      [Op.and]: [
        literal(`JSON_CONTAINS(vehicle, '["${vin}"]') = 1`), // JSON_CONTAINS check
        { status: 'Client Not Connect' } // Make sure status is 'Client Not Connect'
      ]
    }
  });

  if (campaign) {
    throw new ApiError(402, 'Campaign Is Running For This Vehicle')
  }

  const deletedVehicle = await Vehicle.destroy({ where: { vin } });
  if (!deleteVehicle) {
    throw new ApiError(400, "Could not delete the VIN");
  }

  res.status(200).json(new apiResponse(200, deletedVehicle, "Success"))
});



const updateVehicle = asyncHandler(async (req, res) => {
  console.log("Entered Into Update Vehicle API");

  const { vin } = req.body;  // Extract VIN from the request body

  // Check if VIN is provided
  if (!vin) {
    return res.status(400).json({ message: "VIN is missing." });
  }

  // Find the vehicle with the provided VIN
  const vehicle = await Vehicle.findOne({ where: { vin } });

  // Check if the vehicle exists
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found for the given VIN" });
  }

  // Update the vehicle's delete status to 'Deleted'
  const updatedVehicle = await Vehicle.update(
    { vehicleDelHistory: "Deleted" },
    { where: { vin } }
  );

  // Check if the update was successful
  if (updatedVehicle[0] === 0) {
    return res.status(500).json({ message: "Failed to update vehicle status" });
  }

  console.log("Exit To The Update Vehicle API");
  // Send success response
  res.status(200).json({
    message: "Vehicle status updated successfully",
    vin: vin,
    vehicleDelHistory: "Deleted", // Return the updated field
  });
});




export { registerVehical, getVehicle, deleteVehicle, updateVehicle, getDeletedVehicle };

