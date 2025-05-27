import { DataTypes } from "sequelize";
import { sequelize } from "../DB/DbConfig.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ROLES, STATUS } from "../constants.js";


const User = sequelize.define('User',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV1,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      min: [3, "First name should have minimun 3 characters"],
      required: true,
      trim: true,
    },
    lastName: {
      type: DataTypes.STRING,
      required: true,
      trim: true,
    },
    userEmail: {
      type: DataTypes.STRING,
      required: true,
      trim: true,
      primaryKey: true,
      lowercase: true,
    },
    password: {
      type: DataTypes.STRING,
      trim: true,
      required: [true, "Password is required"],

    },
    refreshToken: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: ROLES.NORMAL
    },
    Status: {
      type: DataTypes.STRING,
      defaultValue: STATUS.INVITED
    },
  },
  {
    timestamps: true,
  }
);


User.beforeSave("save", async function (user, next) {
  if (!user.changed("password")) return;

  user.password = await bcrypt.hash(user.password, 10);
  console.log("Password Encrypted")
  //next();
});



User.prototype.isPasswordCorrect = async function (password) {
  console.log('Password', password)
  return await bcrypt.compare(password, this.password);
};



User.prototype.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this.id,
      userEmail: this.userEmail,
      userName: this.firstName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};



User.prototype.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export { User }
//export const User = mongoose.model("User", User);

