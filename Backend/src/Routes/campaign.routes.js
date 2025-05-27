import { Router } from "express";
import {
  checkUpdate,
  createCampaign,
  deleteCampaign,
  downloadFile,
  getCampaignList,
  updateInstallstatus,
  CampaignDeleteHistory,
  getDelCampaignList,
  ShowSoftwareStatus,
  GetSoftwareStatus
} from "../Controller/campaign.controller.js";
import { asyncHandler } from "../Utils/asyncHandler.js"; // Assuming asyncHandler is a custom utility

const router = Router();

// Route for creating a campaign
router.route("/createCampaign")
  .post(asyncHandler(createCampaign));

// Route for getting the list of campaigns
router.route('/getCampaignList')
  .get(asyncHandler(getCampaignList));

router.route('/getDelCampaignList').get(getDelCampaignList);

// Route for checking updates for a campaign
router.route("/checkUpdate")
  .post(asyncHandler(checkUpdate));

// Route for downloading a file
router.route("/download/:id")
  .get(asyncHandler(downloadFile));

// Route for updating the installation status
router.route('/CheckStatus')
  .post(asyncHandler(updateInstallstatus));

// Route for deleting a campaign
router.route('/deleteCampaign')
  .delete(asyncHandler(deleteCampaign));

router.route('/campaignDeleteHistory').post(CampaignDeleteHistory)

router.route('/softwarestatus')
  .post(ShowSoftwareStatus)

router.route('/getsoftwarestatus')
  .get(GetSoftwareStatus)


export default router;


