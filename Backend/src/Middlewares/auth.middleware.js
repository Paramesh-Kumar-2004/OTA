import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/apiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import Jwt from "jsonwebtoken";



export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("TOKEN From verifyJWT Function :", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ where: { id: decodedToken?.id } });

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid User Token");
  }
});

