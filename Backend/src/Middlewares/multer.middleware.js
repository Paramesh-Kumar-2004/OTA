import multer from "multer";


const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    console.log("\nEntered Into Multer")
    cb(null, "./public")
  },

  filename: function (req, file, cb) {
    const { softwareName, version } = req.body
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)  // Name Generate 1
    const uniqueSuffix = Date.now()
    // cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)  // Name Generate 2
    cb(null, file.originalname)
    // cb(null, softwareName.trim() + "_" + version.replace(".", "_") + ".apk")  // Name Generate 3
  }

})

export const upload = multer({ storage })

