import dotenv from 'dotenv'
import connectDB from "./DB/index.js";
import { app } from "./app.js";

dotenv.config({ path: './.env' })

connectDB().then(() => {
  app.listen(process.env.PORT || 8000, process.env.LOCAL_NETWORK_IP, () => {
    console.info(`My Cors Origin Is :\n\t ${process.env.CORS_ORIGIN} (Verify This IP) Open This Port To Check Web (For Frontend)\n`)
    console.log("If You Want To Use React Build, First Update Cors Orgin & Make Build File.\nBuild File Running Routes Also Done Just Create A Build And Rename As A Frontend And Save In Correct Location.\n")
    console.info("Check CORS ORGIN\n")
    console.log('Server Is Running At The Port  :', `http://${process.env.LOCAL_NETWORK_IP}:${process.env.PORT} (For Backend)\n`,) //For Production
  })
}).catch(err => {
  console.log('Database connection failed', err)
})