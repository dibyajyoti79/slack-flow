import jwt from "jsonwebtoken";
import { serverConfig } from "../config";

type TokenPayload = {
  id: string;
  email: string;
};

export const generateToken = (payload: TokenPayload) => {
  const token = jwt.sign(payload, serverConfig.JWT_SECRET, {
    expiresIn: serverConfig.JWT_EXPIRY,
  });
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, serverConfig.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};
