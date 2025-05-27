import { Router } from "express";
const router = Router();
import {
  createSoftware,
  deleteSoftware,
  getSoftwareList,
  getDelSoftwareList,
  softwareDeleteHistory
} from "../Controller/software.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";

router.route("/getSoftwareList").get(getSoftwareList);
router.route("/getDelSoftwareList").get(getDelSoftwareList);
  
router.route("/createSoftware").post(upload.fields([{ name: "softwareFile", maxCount: 1 }]), createSoftware);
router.route('/deleteSoftware').delete(deleteSoftware)
router.route('/deleteStatus').post(softwareDeleteHistory)

export default router;
 