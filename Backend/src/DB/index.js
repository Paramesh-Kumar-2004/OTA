import { sequelize } from "./DbConfig.js";
import createAdminUser from "../Utils/addAdminUser.js"



const connectDB = async () => {
  try {
    console.log("\t\nTrying To Connect Database...\n");
    await sequelize.authenticate();
    await sequelize.sync()
    console.log("\nDatabse Connection Success...");
    console.log("Tables Are Created Successfully...\n");
    await createAdminUser();
  } catch (err) {
    console.log("Databse Connection Failed", err);
  }
};
export default connectDB;





