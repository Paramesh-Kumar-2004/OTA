
import { DataTypes } from "sequelize";
import { sequelize } from "../DB/DbConfig.js";
export const Otp = sequelize.define('Otp',{
    userEmail: {
        type:DataTypes.STRING,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
      },
    otp:{
        type: DataTypes.INTEGER,
        required : true
    }
})

//export const Otp = mongoose.model("Otp", otpSechema);