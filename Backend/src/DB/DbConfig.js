import { DB_NAME } from "../constants.js";
import { Sequelize } from "sequelize";


export const sequelize = new Sequelize(DB_NAME, "root", "Welcome@123", {
  host: "localhost",
  dialect: "mysql",
  timezone: '+05:30'
});




