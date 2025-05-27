import { DataTypes } from "sequelize";
import { sequelize } from "../DB/DbConfig.js";
import { CAMPAIGN_TYPE, CampaignStatus, DeleteHistory } from "../constants.js";



export const Campaign = sequelize.define('Campaign',
  {
    campaignID: {
      type: DataTypes.STRING,
      unique: true,
      required: true,
    },
    campaignName: {
      type: DataTypes.STRING,
    },
    campaignDescription: {
      type: DataTypes.STRING,
    },
    campaignType: {
      type: DataTypes.STRING,
      default: CAMPAIGN_TYPE.NORMAL,
    },
    vehicle: {
      type: DataTypes.JSON
    },
    software: {
      type: DataTypes.STRING,
    },
    softwareName: {
      type: DataTypes.STRING,
    },
    campaignDelHistory: {
      type: DataTypes.STRING,
      defaultValue: DeleteHistory.Value,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: CampaignStatus.DEFAULT_VALUE
    },
    updateType: {
      type: DataTypes.STRING

    },

    expiresAt: {
      type: DataTypes.DATE,
      // defaultValue: () => new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 Day
      defaultValue: () => new Date(Date.now() + 1 * 60 * 1000) // 1 minute from create
    }
  },
  { timestamps: true },
)


