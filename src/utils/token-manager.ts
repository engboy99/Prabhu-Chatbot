import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { COOKIE_NAME } from "./constant.js";

export const createToken = (
  id: string,
  email: string,
  expiresIn: string
) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET!, {
    expiresIn,
  });
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.locals.jwtData = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
