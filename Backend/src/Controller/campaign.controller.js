import { Campaign } from '../Models/campaign.model.js';
import { SoftwareStatus } from '../Models/vehicle_status.model.js';
import { Software } from '../Models/software.model.js';
import { ApiError } from '../Utils/apiError.js';
import { apiResponse } from '../Utils/apiResponse.js';
import { asyncHandler } from '../Utils/asyncHandler.js';
import fs from 'fs';
import crypto, { generateKey } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from "../DB/DbConfig.js";

// Encryptions
import { encryptAPKFile, createTarball } from './encryptionHelper.js'
import { encryptKeyFileWithPublicKey } from "./encrypt_key_iv.js"
import { digitalsign } from './digitalsign.js';
import { generateRsaKeyPair } from "./new_keypair.js"

// For First Letter Making As Caps
import cap from "lodash"
import { Op, literal } from "sequelize"



// File paths for encryption and file management
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../../public');




// Create a new campaign
export const createCampaign = asyncHandler(async (req, res) => {
  const {
    campaignID,
    campaignName,
    campaignDescription,
    campaignType,
    vehicle,
    software,
    updateType,
  } = req.body;

  const softwareDetails = await Software.findOne({ where: { softwareId: software } })
  const softwareName = softwareDetails.dataValues.softwareName // It's Contain The Software Name

  console.log("\nCreate Campaign Request Body Datas :\n", req.body)

  // Check for required fields
  if (
    [campaignID, campaignName, campaignType].some((item) => item?.trim() === "")
  ) {
    throw new ApiError(400, "Required Fields are missing");
  }


  for (let VIN of vehicle) {
    // Convert the VIN to a string
    const VINString = VIN.toString();
    try {
      const isAlreadyExistSoftwareStatus = await SoftwareStatus.findOne({
        where: { Vehicle_VIN: VINString },
        order: [['createdAt', 'DESC']]  // Order by created date, most recent first
      });

      // If a status is found
      if (isAlreadyExistSoftwareStatus) {
        // Check if the status is "Client Not Connect"
        if (isAlreadyExistSoftwareStatus.Status.toLowerCase() === 'client not connect') {
          console.log(`Software Already Present For VIN: ${VINString}`);
          // Return a response if the status is "Client Not Connect"
          return res.status(400).json({ message: `${VINString} Software Already Running For This VIN` });
        }

        // Check if the status is "Failed", "Cancelled", or "Success"
        if (['failed', 'cancelled', 'success'].includes(isAlreadyExistSoftwareStatus.Status.toLowerCase())) {
          console.log("\nThe Old Vehicle Data  :\n", isAlreadyExistSoftwareStatus.dataValues, "\n");
          // Proceed with the next process (add your next steps here)
        } else {
          // If the status is neither "Client Not Connect" nor valid ("Failed", "Cancelled", "Success")
          console.log(`Invalid status for VIN: ${VINString}. Status: ${isAlreadyExistSoftwareStatus.Status}`);
        }
      } else {
        // If no status found
        console.log(`No status found for VIN: ${VINString}\n`);
      }
    } catch (error) {
      console.log(`Error fetching status for VIN: ${VINString}. Error: ${error.message}`);
    }
  }

  const campaign = await Campaign.create({
    campaignID,
    campaignName,
    campaignDescription,
    campaignType,
    vehicle,
    software,
    softwareName,
    updateType,
  });

  if (!campaign) {
    throw new ApiError(500, "Could not create a campaign");
  }
  console.log("\nCampaign Created Successfully", "\nCampaign ID :", campaign.campaignID, "\n");


  const createdStatuses = [];
  for (let i of vehicle) {
    const VarVehicleStatus = await SoftwareStatus.create({
      campaignID,
      Vehicle_VIN: i,  // i is the individual vehicleVIN from the array
      SoftwareID: software,
      ClientNotConnect: Date.now(),
    });
    createdStatuses.push(VarVehicleStatus);
    console.log("\nVehicle VIN:", i);
  }

  if (createdStatuses.length === 0) {
    throw new ApiError(500, "Could not create a campaign");
  }
  console.log("Campaign Install Status Successfully Done\n");

  res.status(200).json(new apiResponse(200, campaign, "Success"));
});





// Get all campaigns
export const getCampaignList = asyncHandler(async (req, res) => {
  console.log("\nEntered Into getCampaignList API")

  await SoftwareStatus.update(
    {
      Status: "Cancelled",
      Cancel: Date.now(),
      Success: null, Failed: null, ClientNotConnect: null
    },
    {
      where: {
        expiresAt: {
          [Op.lt]: new Date()
        },
        Status: "Client Not Connect"
      }
    }
  );

  const campaigns = await Campaign.findAll({ order: [['createdAt', 'DESC']] })
  for (const campaign of campaigns) {
    await getCampaignStatusAndPrint(campaign.campaignID);
  }

  const updatedCampaigns = await Campaign.findAll({ order: [['createdAt', 'DESC']] })

  if (!updatedCampaigns) {
    throw new ApiError(400, "No Campaign in Database");
  }
  res.status(200).json(new apiResponse(200, updatedCampaigns, "Success"));
});



export const getDelCampaignList = asyncHandler(async (req, res) => {
  // console.log("\nEntered Into Deleted Get CampaignList API")
  // Perform raw SQL query with JOIN to get campaign details along with softwareName
  const campaigns = await sequelize.query(
    `
      SELECT c.*, s.softwareName 
      FROM Campaigns c
      JOIN Software s ON c.software = s.softwareId
      WHERE c.campaignDelHistory = 'Deleted'
    `,
    {
      type: sequelize.QueryTypes.SELECT
    }
  );
  // console.log("\nCampaigns Status",campaigns)

  if (campaigns.length === 0) {
    // throw new ApiError(404, "No Deleted Campaign in Database");
    console.log("No Deleted Campaigns In The Database\n");
  }

  // Send response with the retrieved data
  res.status(200).json(new apiResponse(200, campaigns, "Success"));
});



// Handle check for update
export const checkUpdate = asyncHandler(async (req, res) => {
  try {
    console.log("\n\nEntered Into checkUpdate() Function\n\n")
    const { VIN, VER, publickey } = req.body;
    const encApkName = `updateEnc2`
    const APKTarGzFileName = "update.tar.gz"
    const keysjson = `keys.json`
    const enckeyName = `encrypted_key_iv.bin`
    const tarFileName = `updatefile.tar.gz`
    const tarfolder = path.basename(tarFileName, ".tar.gz")
    // const digitalSignName = 'Digital_Signature.bin'
    const outputKeyFilePath = path.join('public', keysjson)

    const newPrivateKeyName = `new_public_key.pem`
    const newPublicKeyName = `new_private_key.pem`
    const signcertificateName = `signature_cert.pem`

    if (!VIN || !VER || !publickey) {
      throw new ApiError(400, "VIN, version, or public key is missing");
    }

    const campaign = await Campaign.findOne({
      where: {
        [Op.and]: [
          literal(`JSON_CONTAINS(vehicle, '["${VIN}"]') = 1`),
          { campaignDelHistory: 'Present' }
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    if (!campaign) {
      throw new ApiError(404, "Campaign not found for the given VIN");
    }


    // const SoftwareStatusData = await SoftwareStatus.findOne({
    //   where: {
    //     Vehicle_VIN: VIN
    //   },
    //   order: [['createdAt', 'DESC']]
    // })

    // console.log("Software Status : ", SoftwareStatusData)
    // if (SoftwareStatusData.Status.toLowerCase() === "success") {
    //   console.log(`\n${campaign.campaignName} Is Already Installed For This Vehicle`);
    //   throw new ApiError(404, "Given Campaign Is Already Installed For This Vehicle", "Already Installed")
    // }

    // Get the software details for the campaign
    const software = await Software.findOne({ where: { softwareId: campaign.software } });
    if (!software) {
      throw new ApiError(404, "Software not found");
    }

    // const buffer = Buffer.from(software.softwareUrl, 'hex');

    // Convert the buffer to a string
    // const decodedAPK = buffer.toString('utf8');

    // console.log("\n\n", decodedAPK)

    // Check if update is available
    const isUpdateAvailable = Number(VER) < Number(software.version);
    // const isUpdateAvailable = Number(VER) < Number(software.version) && campaign.status.toLowerCase() !== "success";

    const response = {
      "update-available": isUpdateAvailable ? "yes" : "no",
      updateType: campaign.updateType,
      softwareUrl: software.softwareUrl, // Default to the tarball if update is available
      softwareVer: software.version,
      softwareName: software.softwareName,
      softwarePath: tarFileName, // Path of the tarball for downloading
      // tarFolderName:tarfolder,
      CampaignName: campaign.campaignName,
    };

    // fs.writeFileSync(path.join(__dirname,"../../public/APPS",decodedAPK),decodedAPK)

    if (isUpdateAvailable) {
      const inputAPKPath = path.join('public', software.softwareUrl);
      if (!fs.existsSync(inputAPKPath)) {
        throw new ApiError(404, `APK file not found at path: ${inputAPKPath}`);
      }

      const aesKeyBuffer = crypto.randomBytes(32); // AES key (256 bits)
      const ivBuffer = crypto.randomBytes(16); // IV (128 bits)

      console.log("\nKeys For APK Encryption")
      console.log('Generated AES Key:', aesKeyBuffer.toString('hex'));
      console.log('Generated IV:', ivBuffer.toString('hex'));
      console.log("AESKEY & IV Successfully Created...")

      // Encrypt APK file
      await encryptAPKFile(software.softwareUrl, path.join('public', encApkName), aesKeyBuffer, ivBuffer, outputKeyFilePath, APKTarGzFileName);
      console.log("Exit To APK ENCRYPTION FUNCTION\n")

      const newkeys = await generateRsaKeyPair()
      response.signPublicKey = newkeys.publicKey

      await digitalsign()

      // Encrypt Key & IV
      const inputFilePath = path.resolve(`./public/${keysjson}`);  // Path to your input file
      const outputFilePath = path.resolve(`./public/${enckeyName}`);  // Path to save encrypted output
      const publicKey = publickey
      await encryptKeyFileWithPublicKey(inputFilePath, outputFilePath, publicKey)
        .then(() => {
          // This block runs only after encryption is successfully completed
          console.log("Proceeding to the next process after successful encryption.");
          // Call the next process or function here
        })
        .catch((err) => {
          // Handle errors, if any
          console.error("Encryption failed. Error:", err);
          throw err;
        });

      await createTarball([encApkName, enckeyName, signcertificateName], tarFileName);

      fs.unlinkSync(path.join(publicDir, encApkName))
      fs.unlinkSync(path.join(publicDir, keysjson))
      fs.unlinkSync(path.join(publicDir, signcertificateName))
      fs.unlinkSync(path.join(publicDir, newPrivateKeyName))
      fs.unlinkSync(path.join(publicDir, newPublicKeyName))
      fs.unlinkSync(path.join(publicDir, APKTarGzFileName))
      fs.unlinkSync(path.join(publicDir, enckeyName))
      fs.unlinkSync(path.join(publicDir, "outh"))
    }

    console.log("\nServer Response :")
    console.log(response);
    console.log("Done...\n")
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in checkUpdate handler:", error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});



// Update install status
export const updateInstallstatus = asyncHandler(async (req, res) => {
  const { Status, VIN, CampaignID } = req.body;
  console.log("\nUpdate Install Status Function Called\nData : ", req.body, "\n");

  if (CampaignID && !VIN) {

    await SoftwareStatus.update(
      {
        Status: "Cancelled",
        Cancel: Date.now(),

        // Set Others to NULL when status is Failed
        Success: null, Failed: null, ClientNotConnect: null
      },
      {
        where: {
          campaignID: CampaignID
        }
      }
    );

    await getCampaignStatusAndPrint(CampaignID);
    console.log("\nCampaign ID :", CampaignID, "\n\n")
    res.status(200).json({
      "Message": "The Campaign Status Updated Successfully"
    })
  }

  else {
    if (!Status || !VIN) {
      throw new ApiError(400, "VIN , Status , CampaignID Are Missing");
    }

    const softwarestatus = await SoftwareStatus.findOne({
      where: {
        Vehicle_VIN: VIN,
      },
      order: [['createdAt', 'DESC']]  // Order by created date, most recent first
    });
    // console.log("\n", softwarestatus, "\n")
    if (!softwarestatus) {
      throw new ApiError(400, "Invalid VIN");
    }

    if (Status.toLowerCase() === "success") {
      await SoftwareStatus.update(
        {
          Success: Date.now(),

          // Set Others to NULL when status is Failed
          Cancel: null, Failed: null, ClientNotConnect: null
        },
        {
          where: {
            Vehicle_VIN: VIN
          }
        },
        // order: [['createdAt', 'DESC']]  // Order by created date, most recent first
      );
    }
    if (Status.toLowerCase() === "cancelled") {
      await SoftwareStatus.update(
        {
          Cancel: Date.now(),

          // Set Others to NULL when status is Failed
          Success: null, Failed: null, ClientNotConnect: null
        },
        {
          where: {
            Vehicle_VIN: VIN
          }
        }
      );
    }
    if (Status.toLowerCase() === "failed") {
      await SoftwareStatus.update(
        {
          Failed: Date.now(),

          // Set Others to NULL when status is Failed
          Success: null, Cancel: null, ClientNotConnect: null
        },
        {
          where: {
            Vehicle_VIN: VIN
          }
        }
      );
    }

    try {
      const updatedStatus = await SoftwareStatus.findOne({
        where: {
          Vehicle_VIN: VIN
        },
        order: [['createdAt', 'DESC']]
      });

      // Capitalize the status
      updatedStatus.Status = cap.capitalize(Status);
      const isUpdated = await updatedStatus.save();
      console.log("Updated Campaign Status:", updatedStatus);
      console.log("\nCampaign ID:", isUpdated.campaignID);
      console.log("\Vehicle_VIN :", isUpdated.Vehicle_VIN, "\n\n");

      if (!isUpdated) {
        throw new ApiError(500, "Could not update the status");
      }


      await getCampaignStatusAndPrint(isUpdated.campaignID);
      console.log(isUpdated)
      res.status(200).json(new apiResponse(200, isUpdated, "Success"));
    }
    catch (err) {
      console.log("Error While Saving Status In Campaign Table")
      throw new ApiError(500, "Could not update the status");
    }
  }
});



// Delete a campaign
export const deleteCampaign = asyncHandler(async (req, res) => {
  const { campaignID } = req.body;

  if (!campaignID) {
    throw new ApiError(400, "No campaign id to delete");
  }

  const campaign = await Campaign.destroy({
    where: { campaignID: campaignID },
  });

  if (!campaign) {
    throw new ApiError(500, "Could not delete the campaign");
  }

  res.status(200).json(new apiResponse(200, {}, "Success"));
});


export const CampaignDeleteHistory = asyncHandler(async (req, res) => {
  console.log("Entered Into The CampaignDeleteHistory API")

  const { campaignID } = req.body;
  console.log('Campaign ID:', campaignID)

  const campaign = await Campaign.findOne({
    where: {
      campaignID,
      campaignDelHistory: "Present"
    }
  })
  if (!campaign) {
    throw new ApiError(402, 'Invalid Campaign Id')
  }

  const updateCampaignDelStatus = await Campaign.update(
    { campaignDelHistory: "Deleted" },
    { where: { campaignID } }
  );
  // Check if the update was successful
  if (updateCampaignDelStatus[0] === 0) {
    return res.status(500).json({ message: "Failed to update Campaign Delete status" });
  }

  res.status(200).json({
    Message: "Campaign status updated successfully",
    CampaignID: campaignID,
    CampaignDeleteHistory: "Deleted", // Return the updated field
  });
})



export const ShowSoftwareStatus = asyncHandler(async (req, res) => {
  console.log("\nEntered Into Show Softare Status Function")
  const { CampaignID } = req.body
  const Software_Status = await SoftwareStatus.findAll({ where: { campaignID: CampaignID } })
  try {
    console.log("\nCampaign Install Status Reponse :\n", Software_Status)

    res.status(200).json({ Software_Status })
  } catch (error) {
    console.log("\nSomething Went Wrong\n")
    res.status(404).json({ "Error Message": "Something Went Wrong" })
  }
})


// Get All SoftwareStatus 
export const GetSoftwareStatus = asyncHandler(async (req, res) => {

  const Software_Status = await SoftwareStatus.findAll({ where: {} })

  try {
    console.log("\nCampaign Install Status Reponse :\n", Software_Status)
    res.status(200).json({ Software_Status })
  } catch (error) {
    console.log("\nSomething Went Wrong\n")
    res.status(404).json({ "Error Message": "Something Went Wrong" })
  }
})



// Download a file from the server
export const downloadFile = asyncHandler(async (req, res) => {
  console.log("\nDownload File Function Called");
  const filePath = path.join('public', req.params.id);

  // Check if file exists before attempting to send it
  if (!fs.existsSync(filePath)) {
    console.log("Could Not Find The File");
    return res.status(404).json({ error: 'Could Not Find The File' });
  }

  console.log("\nFile Found. Preparing To Send...");
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error In res.download:", err);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Error Downloading The File' });
      }
    }
    else {
      console.log("File Send Successfully.");
    }
  });
});














// Function to get statuses for the specified CampaignID and calculate the final status
async function getCampaignStatusAndPrint(CampaignID) {
  try {
    // 1. Fetch all software statuses for the specified CampaignID
    const statuses = await SoftwareStatus.findAll({ where: { campaignID: CampaignID } });

    // If no statuses are found for the campaign, print an error message and return
    if (statuses.length === 0) {
      console.log(`No statuses found for CampaignID ${CampaignID}`);
      return;
    }

    // 2. Extract statuses from the fetched data
    const statusArray = statuses.map(item => item.Status);

    // 3. Determine the final status based on the unique statuses
    const uniqueStatuses = [...new Set(statusArray)]; // Get unique statuses

    let finalStatus = "";

    // If all statuses are the same, return that status
    if (uniqueStatuses.length === 1) {
      finalStatus = uniqueStatuses[0];
    }
    // If "Success" exists along with other statuses, return "Partial Success"
    else if (uniqueStatuses.includes("Client Not Connect")) {
      finalStatus = "Client Not Connect";
    }
    else if (
      uniqueStatuses.includes("Success")
      || uniqueStatuses.includes("Failed")
      && !uniqueStatuses.includes("Client Not Connect")
    ) {
      finalStatus = "Partial Success";
    }
    // If neither of the above, return the unique statuses as a comma-separated string
    else {
      finalStatus = uniqueStatuses.join(", ");
    }

    console.log(`\n\nFinal Campaign Status : ${finalStatus}`)
    const result = await Campaign.update(
      { status: finalStatus },
      {
        where: { campaignID: CampaignID }
      }
    );

    // Check if any rows were affected
    if (result[0] > 0) {
      console.log("\n\nThe Campaign Status has been updated successfully.");
    } else {
      console.log("\n\nNo rows were updated. Check if the campaignID exists or if the status is the same.");
    }


    // 6. Print the updated campaign status
    console.log(`Updated CampaignID: ${CampaignID}, Status: ${finalStatus}\n`);

  } catch (error) {
    console.error("Error processing campaign status:", error);
  }
}

