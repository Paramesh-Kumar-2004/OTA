import nodemailer from "nodemailer";
import { Otp } from "../Models/OTP.model.js";
import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { generateOtp } from "../Utils/otpGenerator.js";



const cookieOptions = {
  httpOnly: true,  // Prevent JavaScript access to cookies
  secure: process.env.NODE_ENV === 'production',  // Set to true in production for HTTPS
  sameSite: 'Strict',  // Cookies only sent for same-site requests
  maxAge: 24 * 60 * 60 * 1000,  // Set cookie expiration (1 day)
};



const generateAccessAndRefreshTokens = async (userId) => {
  try {
    console.log("\nUser ID :", userId);
    const user = await User.findOne({ where: { id: userId } });
    console.log("User Details From generateAccessAndRefreshTokens() :", user.dataValues);
    const accessToken = user.generateAccessToken();
    const refereshToken = user.generateRefreshToken();
    user.refreshToken = refereshToken;
    console.log("After Resfresh", refereshToken);
    await user.save();

    return { accessToken, refereshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, userEmail, password } = req.body;
  console.log("Request registerUser: ", req.body);
  if ([firstName, userEmail, password].some((item) => item.trim() === "")) {
    throw new ApiError(400, "Some required fields are missing");
  }

  const isUserExist = await User.findOne({ where: { userEmail: userEmail } });

  if (isUserExist) {
    throw new ApiError(401, "User with this email is already exists");
  }

  const createdUser = await User.create({
    firstName,
    lastName,
    userEmail: userEmail.toLowerCase(),
    password,
  });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  res.status(200).json(new apiResponse(200, createdUser, "Success"));
});




const loginUser = asyncHandler(async (req, res) => {
  const { userEmail, password } = req.body;
  console.log("Login Request Recived");
  if (!userEmail || !password) {
    throw new ApiError(400, "Email and password is required fields");
  }
  const user = await User.findOne({ where: { userEmail: userEmail } });

  if (!user) {
    throw new ApiError(404, "User Not found with Given user email");
  }
  const isvalidPassword = await user.isPasswordCorrect(password);
  if (!isvalidPassword) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refereshToken } = await generateAccessAndRefreshTokens(user.id);

  const loggedInUser = await User.findOne({
    where: { id: user.id },
    attributes: ['refreshToken', 'userEmail', 'role']
  });


  // console.log("\n\nRequest is being handled by:", req.hostname, req.connection.remoteAddress);
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refereshToken, cookieOptions)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refereshToken,
        },
        "User Logged In Successfully"
      )
    );
});



const logoutUser = asyncHandler(async (req, res) => {

  console.log("\nEntered Into LogoutUser Controller")

  const logout = await User.findOne({ where: { id: req.user.id } });

  console.log("\nCookies From Client Browser:\n", req.cookies)

  if (!logout) {
    console.log("User Not Found")
    throw new ApiError(404, "User Not Found");
  }

  logout.refreshToken = null;
  await logout.save()


  console.log("After Logout User Data :\n", logout.dataValues)

  // res.clearCookie("accessToken", cookieOptions)
  // res.clearCookie("refreshToken", cookieOptions)

  res.clearCookie("accessToken")
  res.clearCookie("refreshToken")

  return res.status(200).json(new apiResponse(200, logout, "User Logged Out"));
});




const getUsers = asyncHandler(async (req, res) => {
  const usersList = await User.findAll({
    where: {},
    order: [['createdAt', 'DESC']]
  });
  return res.status(200).json(new apiResponse(200, usersList, "Success"));
});


const updateUser = asyncHandler(async (req, res) => {
  const { userEmail, role, Status } = req.body;

  console.log("Update User :", req.body)

  if (userEmail.trim() === "") {
    throw new ApiError(400, "Missing User Email ");
  }

  const user = await User.findOne({ where: { userEmail: userEmail } });


  if (!user) {
    throw new ApiError(500, "Could Not Update The User");
  }

  user.role = role;
  user.Status = Status;
  await user.save();

  return res.status(200).json(new apiResponse(200, user, "Success"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { userEmail } = req.body;

  if (!userEmail) {
    throw new ApiError(400, "Missing user email");
  }

  let user = await User.findOne({ where: { userEmail: userEmail } });
  if (!user) {
    throw new ApiError(404, "No user found with associated email id");
  }

  const otp = generateOtp();

  const result = await Otp.update(
    {
      userEmail: userEmail,
      otp: otp,
    },
    {
      where: { userEmail: userEmail },
    }
  );

  if (!result) {
    throw new ApiError(500, "Could could generate the OTP");
  }

  const mailData = {
    from: process.env.OTPEMAIL,
    to: userEmail,
    subject: "OTP for Password Recovery",
    text: "text",
    html: `Your OTP for reseting your password is, <br/> <b> ${otp} </b>`,
  };

  const transporter = nodemailer.createTransport({
    host: process.env.OTP_EMAIL_HOST,
    port: process.env.OTP_EMAIL_PORT,
    secureConnection: true,
    auth: {
      user: process.env.OTP_EMAIL,
      pass: process.env.OTP_EMAIL_PASSWORD,
    },

    tls: {
      ciphers: "SSLv3",
    },
  });

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.status(200).json(new apiResponse(200, {}, "Success"));
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { userEmail, password, otp } = req.body;
  if ([userEmail, password, otp].some((item) => item.trim() === "")) {
    throw new ApiError(400, "Required Fields are missing");
  }
  const validateOTP = await Otp.findOne({ where: { userEmail: userEmail } });
  if (validateOTP.otp !== Number(otp)) {
    throw new ApiError(400, "InValid OTP");
  }
  const user = await User.findOne({ where: { userEmail: userEmail } });
  user.password = password;

  await user.save();
  await Otp.describe({ where: { userEmail: userEmail } });

  if (!user) {
    throw new ApiError(500, "Could Not update the Password");
  }

  res.status(200).json(200, user, "Password updated");
});


const deleteUser = asyncHandler(async (req, res) => {
  console.log("Entered Into deleteUser API");

  // Make sure you're extracting the 'id' from req.body, not req.data
  const { id } = req.body.id;  // Ensure that the body contains the 'id' property
  console.log("User ID:", id);

  if (!id) {
    throw new ApiError(400, "No User Found to delete");
  }

  // Assuming you are using Sequelize or any ORM for deletion
  const user = await User.destroy({
    where: { id: id },
  });

  if (!user) {
    throw new ApiError(500, "Could not delete the User", "User Not Found For Given ID");
  }

  res.status(200).json(new apiResponse(200, { id }, "User Deletion Success"));
});

export {
  getUsers, loginUser,
  logoutUser, registerUser, resetPassword,
  updatePassword, updateUser, deleteUser
};


