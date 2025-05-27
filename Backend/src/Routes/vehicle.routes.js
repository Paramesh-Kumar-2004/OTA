import { Router } from "express";
import { registerVehical, getVehicle,deleteVehicle,getDeletedVehicle ,updateVehicle } from "../Controller/vehicle.controller.js";
const router = Router();


router.route("/register").post(registerVehical);
router.route('/getVehicle').get(getVehicle);
router.route('/getDeletedVehicle').get(getDeletedVehicle);
router.route('/delete').delete(deleteVehicle)
router.route('/updateVehicle').post(updateVehicle)



// updateVehicle
export default router;
 