import { DataTypes } from "sequelize";
import { sequelize } from "../DB/DbConfig.js";
import { CampaignStatus } from "../constants.js";


export const SoftwareStatus = sequelize.define("SoftwareStatus",
    {
        campaignID: {
            type: DataTypes.STRING,
            unique: false,
            required: true,
        },
        Vehicle_VIN: {
            type: DataTypes.STRING,
            required: true
        },
        SoftwareID: {
            type: DataTypes.STRING,
            unique: false,
            required: true
        },
        Status: {
            type: DataTypes.STRING,
            defaultValue: CampaignStatus.DEFAULT_VALUE
        },
        ClientNotConnect: {
            type: DataTypes.DATE,
        },
        Success: {
            type: DataTypes.DATE,
        },
        Cancel: {
            type: DataTypes.DATE,
        },
        Failed: {
            type: DataTypes.DATE,
        },

        expiresAt: {
            type: DataTypes.DATE,
            defaultValue: () => new Date(Date.now() + 1 * 60 * 1000) // 1 minute from create
            // defaultValue: () => new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 Day
        }

    }, { timestamps: true, tableName: "SoftwareStatus" }
)