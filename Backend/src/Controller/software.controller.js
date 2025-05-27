import { c } from "tar";
import { Software } from "../Models/software.model.js";
import { Campaign } from "../Models/campaign.model.js";
import { ApiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import path from "path"
import { fileURLToPath } from 'url';
import fs from "fs"




// File paths for encryption and file management
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../../public');



const createSoftware = asyncHandler(async (req, res) => {

  const { softwareId, softwareName, version } = req.body;

  // console.log("\n\n\n\n\nSoftware Name :", req.files)

  console.log("Request", req.body);

  if ([softwareId, softwareName, version].some((item) => item.trim() === "")) {
    throw new ApiError(400, "Required Fields are missing");
  }

  const softwareLocalPath = req.files?.softwareFile[0]?.filename;
  console.log("Software Local Path :", softwareLocalPath);

  // Get file stats synchronously
  const stats = fs.statSync(path.join(publicDir, softwareLocalPath));
  console.log("\nSoftware :", stats)

  // Convert size to MB
  // const softwareSizeInMB = (stats.size / (1024 * 1024)).toFixed(2) + " MB"; // Size in MB 
  // // Convert size to KB
  // const softwareSizeInKB = (stats.size / 1024).toFixed(2) + " KB"; // Size in KB

  let softwareSize;
  if (stats.size < 1000) {
    // Size is in bytes (decimal)
    softwareSize = (stats.size).toFixed(2) + " B"; // Size in bytes
  } else if (stats.size < 1000 * 1000) {
    // Size is in KB (decimal)
    softwareSize = (stats.size / 1000).toFixed(2) + " KB"; // Size in KB
  } else if (stats.size < 1000 * 1000 * 1000) {
    // Size is in MB (decimal)
    softwareSize = (stats.size / (1000 * 1000)).toFixed(2) + " MB"; // Size in MB
  } else {
    // Size is in GB (decimal)
    softwareSize = (stats.size / (1000 * 1000 * 1000)).toFixed(2) + " GB"; // Size in GB
  }

  console.log(softwareSize);
  console.log("Software Size :", softwareSize, "\n");

  // console.log("Software Size In MB:", softwareSizeInMB);
  // console.log("Software Size In KB:", softwareSizeInKB);

  const software = await Software.create({
    softwareName: softwareName,
    version: version,
    softwareId: softwareId,
    softwareUrl: softwareLocalPath,
    softwareSize: softwareSize
  });


  if (!software) {
    throw new Error(500, "Could not update the software");
  }

  // console.log("Response : ",software)
  res.status(200).json(new apiResponse(200, software, "Success"));
  console.log("\nSoftware Created Successfully\n")
});



const getSoftwareList = asyncHandler(async (req, res) => {
  console.log("Entered into getSoftwareList API");
  const softwares = await Software.findAll({
    where: { softwareDelHistory: "Present" },
    order: [['createdAt', 'DESC']]
  })

  if (!softwares) {
    throw new ApiError(400, "No Software in Database");
  }
  res.status(200).json(new apiResponse(200, softwares, "Success"));
});



const getDelSoftwareList = asyncHandler(async (req, res) => {
  console.log("Enter Into GetDeleteSoftwareList API");

  const software = await Software.findAll({ where: { softwareDelHistory: "Deleted" } })

  res.status(200).json(new apiResponse(200, software, "Success"));

})



const deleteSoftware = asyncHandler(async (req, res) => {

  const { softwareId } = req.body;
  console.log('\nSoftware Id', softwareId)

  if (!softwareId) {
    throw new ApiError(402, 'Invalid software Id')
  }

  const campaign = await Campaign.findOne({
    where: {
      status: "Client Not Connect",
      software: softwareId
    }
  });
  if (campaign) {
    throw new ApiError(402, 'Campaign Is Running For This Software')
  }

  let softwareDetails = await Software.findOne({ where: { softwareId: softwareId } })
  const filePath = path.join(publicDir, softwareDetails.dataValues.softwareUrl);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("\nFile Deleted:", filePath);
  } else {
    console.log("\nFile Not Found:", filePath);
  }


  let software = await Software.destroy({ where: { softwareId: softwareId } });
  console.log("Software Deleted Successfully\n")
  if (!software) {
    throw new ApiError(500, 'Could not delete the software from database');
  }

  res.status(200).json(new apiResponse(200, {}, 'Success'))
})



const softwareDeleteHistory = asyncHandler(async (req, res) => {
  console.log("Entered Into The softwareDeleteHistory API")

  const { softwareId } = req.body;
  console.log('Software Id', softwareId)

  const software = await Software.findOne({ where: { softwareId } })
  if (!software) {
    throw new ApiError(402, 'Invalid software Id')
  }

  const SoftwareAPKName = software.softwareUrl
  console.log("\n\n", SoftwareAPKName, "\n\n")

  if (SoftwareAPKName) {
    fs.unlinkSync(path.join(publicDir, SoftwareAPKName))
  }

  const updateSoftwareDelStatus = await Software.update(
    { softwareDelHistory: "Deleted" },
    { where: { softwareId } }
  );
  // Check if the update was successful
  if (updateSoftwareDelStatus[0] === 0) {
    return res.status(500).json({ message: "Failed to update Software Delete status" });
  }

  res.status(200).json({
    Message: "Vehicle status updated successfully",
    SoftwareID: softwareId,
    softwareDeleteHistory: "Deleted", // Return the updated field
  });
})


export { createSoftware, deleteSoftware, getSoftwareList, getDelSoftwareList, softwareDeleteHistory };

