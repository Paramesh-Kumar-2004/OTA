import { User } from "./Models/user.model.js"
import { Vehicle } from "./Models/vehicle.model.js"
import { Software } from "./Models/software.model.js"
import { Campaign } from "./Models/campaign.model.js"


// Less Data Collections
import { sampleUsers } from "./sampleDataCollection1.js"
import { sampleVehicles } from "./sampleDataCollection1.js"
import { sampleSoftwares } from "./sampleDataCollection1.js"
import { sampleCampaigns } from "./sampleDataCollection1.js"

// // More Data Collections
// import { sampleUsers } from "./sampleDataCollection2.js"
// import { sampleVehicles } from "./sampleDataCollection2.js"
// import { sampleSoftwares } from "./sampleDataCollection2.js"
// import { sampleCampaigns } from "./sampleDataCollection2.js"






async function DeleteSampleUsersDatas() {
    try {
        for (let datas of sampleUsers) {
            await User.destroy(
                {
                    where:
                        { userEmail: datas.userEmail }
                }
            )
        }
        console.log("Success Deleting Sample Users Datas")
    }
    catch (err) {
        console.log("Error Deleting Fake Users Datas")
    }
}


async function DeleteSampleVehicleDatas() {
    try {
        for (let data of sampleVehicles) {
            await Vehicle.destroy(
                {
                    where:
                        { vin: data.vin }
                }
            )
        }
        console.log("Success Deleting Sample Vehicle Datas")
    }
    catch (error) {
        console.log("\nError - Deleting Sample Vehicle Datas")
    }
}


async function DeleteSampleSoftwares() {
    try {
        for (let data of sampleSoftwares) {
            await Software.destroy({
                where: {
                    softwareId: data.softwareId
                }
            })
        }
        console.log("Success Deleting Sample Software Datas")
    }
    catch {
        console.log("\nError - Deleting Sample Software Datas")
    }
}


async function DeleteSampleCampaigns() {
    try {
        for (let data of sampleCampaigns) {
            await Campaign.destroy(
                {
                    where:
                        { campaignID: data.campaignID }
                }
            )
        }
        console.log("Success Deleting Sample Campaign Datas")
    }
    catch (err) {
        console.log("\nError - Deleting Sample Campaign Datas")
    }
}


async function deleteSampleDatas() {
    await DeleteSampleUsersDatas()
    await DeleteSampleVehicleDatas()
    await DeleteSampleSoftwares()
    await DeleteSampleCampaigns()
}

deleteSampleDatas()

 