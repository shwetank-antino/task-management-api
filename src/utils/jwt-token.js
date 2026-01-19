import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}

export const signToken = (payload, expiry) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiry,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
