import { Request, Response } from "express";
import User from "../models/User.js";
import { compare, hash } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constant.js";

/* ===================== GET ALL USERS ===================== */
export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/* ===================== SIGNUP ===================== */
export const userSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id.toString(), user.email, "7d");

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: false, // localhost
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/* ===================== LOGIN ===================== */
export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    const token = createToken(user._id.toString(), user.email, "7d");

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/* ===================== AUTH STATUS ===================== */
export const verifyUser = async (_: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/* ===================== LOGOUT ===================== */
export const userLogout = async (_: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  return res.status(200).json({ message: "Logged out successfully" });
};
