import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export class AuthMiddleware {
  static verifyToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    if (!token) {

      throw new Error("No token provided")
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Attach decoded user info to request object
      (req as any).user = decoded;
      next();
    });
  }
}
