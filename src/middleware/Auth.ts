
import { Request } from "express";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-express";

export const authMiddleware = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AuthenticationError("Authorization header is missing");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new AuthenticationError("Token is missing");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    return decodedToken;
  } catch (err) {
    throw new AuthenticationError("Invalid/Expired token");
  }
};
