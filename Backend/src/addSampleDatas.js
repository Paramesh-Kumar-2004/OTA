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


async function AddSampleUsers() {
    try {
        for (let datas of sampleUsers) {
            await User.create(datas)
            console.log(`User Email : ${datas.userEmail}`)
        }
        console.log("\nSample Users Are Added Successfully\n")
    }
    catch (err) {
        console.log("\nError While Adding Fake Users Datas\n")
    }
}


async function AddSampleVehicles() {
    try {
        for (let data of sampleVehicles) {
            await Vehicle.create(data)
            console.log(`Vehicle VIN : ${data.vin}`)
        }
        console.log("\nSample Vehicle Datas Are Added Successfully\n")
    }
    catch (err) {
        console.log("\nError - Adding Sample Vehicle Datas\n")
    }
}


async function AddSampleSoftware() {
    try {
        for (let data of sampleSoftwares) {
            await Software.create(data)
            console.log(`Software Name : ${data.softwareName}`)
        }
        console.log("\nSample Softwares Are Added Successfully\n")
    }
    catch (err) {
        console.log("\nError - Sample Software Adding\n")
    }
}


async function AddSampleCampaigns() {
    try {
        for (let data of sampleCampaigns) {
            await Campaign.create(data)
            console.log(`Campaign Name : ${data.campaignName}`)
        }
        console.log("\nSample Campaigns Are Added Successfully\n")
    }
    catch (err) {
        console.log("\nError - Sample Campaigns Adding\n")
    }
}


async function createSampleData() {
    await AddSampleUsers()
    await AddSampleVehicles()
    await AddSampleSoftware()
    await AddSampleCampaigns()
}

createSampleData()


 