import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { Routes } from "./routes";
import dotenv from 'dotenv';
import morgan from 'morgan';
import { validationResult } from "express-validator";

dotenv.config();
export class AppError extends Error {
    public statusCode: number;
  
    constructor(message: string, statusCode: number = 500) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
function handleError(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ message });
}

// Create express app
const app = express();
app.use(morgan("tiny"));
app.use(bodyParser.json());

// Register express routes from defined application routes
Routes.forEach(route => {
  (app as any)[route.method](
    route.route,
    ...route.validation, // Middleware for validation
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return next(new AppError('Validation failed', 400)); // Pass validation errors to the error handler
        }

        const result = await (new (route.controller as any))[route.action](req, res, next);
        res.json(result);
      } catch (error) {
        next(error); // Pass errors to the error handler
      }
    }
  );
});

// Use the centralized error handler
app.use(handleError);

export default app;
