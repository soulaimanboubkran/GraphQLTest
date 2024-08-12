import  express, { NextFunction } from "express"
import bodyParser from "body-parser"
import { Request, Response } from "express"
import { Routes } from "./routes"
import dotenv from 'dotenv'
import morgan from 'morgan'
import { validationResult } from "express-validator"

function handleError(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ message });
}

    // create express app
    const app = express()
    app.use(morgan("tiny"))
    app.use(bodyParser.json())
    dotenv.config()


    // register express routes from defined application routes
    Routes.forEach(route => {
        // Apply validation and middleware
        const routeMiddleware = [
            ...route.validation || [],
            ...(route.middleware || []),
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return res.status(400).json({ errors: errors.array() });
                    }
                    const result = await (new (route.controller as any))[route.action](req, res, next);
                    res.json(result);
                } catch (error) {
                    next(error);
                }
            }
        ];
    
        (app as any)[route.method](route.route, ...routeMiddleware);
    });

    app.use(handleError);
export default app;