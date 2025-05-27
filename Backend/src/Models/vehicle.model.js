import { DataTypes } from "sequelize";
import { sequelize } from "../DB/DbConfig.js";
import { DeleteHistory } from "../constants.js";

export const Vehicle = sequelize.define('Vehicle', {
    vin: {
        type: DataTypes.STRING,
        unique: true,
        required: true,
    },
    brandName: {
        type: DataTypes.STRING,
    },
    modelName: {
        type: DataTypes.STRING,
    },
    modelYear: {
        type: DataTypes.INTEGER,
        required: true
    },
    vehicleDelHistory: {
        type: DataTypes.STRING,
        defaultValue: DeleteHistory.Value,
        required: false
    }
}, { timestamps: true })


//export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
