import { DataTypes } from "sequelize";
import { sequelize } from "../DB/DbConfig.js";
import { DeleteHistory } from "../constants.js"

export const Software = sequelize.define('Software', {
  softwareId: {
    type: DataTypes.STRING,
    required: true,
    unique: true
  },
  softwareName: {
    type: DataTypes.STRING,
  },
  version: {
    type: DataTypes.STRING,
    required: true,
  },
  softwareUrl: {
    type: DataTypes.STRING,
  },
  softwareDelHistory: {
    type: DataTypes.STRING,
    defaultValue: DeleteHistory.Value,
  },
  softwareSize: {
    type: DataTypes.STRING
  }
});

//export const Software = mongoose.model("Software", softwareSchema);
