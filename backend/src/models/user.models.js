import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["STUDENT", "MENTOR", "ADMIN"],
      default: "STUDENT",
    },
    avatar: {
      type: String, // cloudinary / image URL
      default: "",
    },
    department: {
      type: String,
      default: "Computer Engineering",
    },
    // Student specific attributes
    rollNo: {
      type: String,
      sparse: true,
      unique: true,
    },
    cgpa: {
      type: Number,
      default: 0.0,
    },
    attendancePercentage: {
      type: Number,
      default: 100.0,
    },
    semester: {
      type: Number,
      default: 1,
    },
    division: {
      type: String,
      default: "Div A",
    },
    phone: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    assignedMentor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Mentor specific attributes
    designation: {
      type: String,
      default: "Assistant Professor",
    },
    domainExpertise: {
      type: [String],
      default: [],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET || "access_secret_12345",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET || "refresh_secret_12345",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
    }
  );
};

export const User = mongoose.model("User", userSchema);
