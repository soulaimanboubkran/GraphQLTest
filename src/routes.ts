import { body, param, ValidationChain } from "express-validator"
import { UserController } from "./controller/User.controller"
import { PostController } from "./controller/Post.controller"
import { AuthController } from "./controller/Auth.controller"
import { AuthMiddleware } from "./middleware/AuthMiddleware";
interface Route {
    method: string;
    route: string;
    controller: any;
    action: string;
    validation?: ValidationChain[];
    middleware?: any[]; // Add middleware property
  }
export const Routes:Route[] = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    validation:[
      
    ]
    
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
    validation:[
        param('id').isInt()
    ]
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save",
    validation:[
        body('firstName').isString(),
        body('lastName').isString(),
        body('age').isInt({min:0}).withMessage('must be positive number')
    ]
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
    validation:[
        param('id').isInt()
    ]
}

, {
    method: "post",
    route: "/posts",
    controller: PostController,
    action: "save",
    validation:[
        body('title').isString(),
        body('body').isString(),
        body('userId').isInt({min:0}).withMessage('must be positive number')
    ],
    middleware: [AuthMiddleware.verifyToken] 
}
, {
    method: "get",
    route: "/posts",
    controller: PostController,
    action: "all",
    validation:[
        
    ]
}
, {
    method: "post",
    route: "/auth/sign-up",
    controller: AuthController,
    action: "register",
    validation:[
        body('firstName').isString(),
        body('lastName').isString(),
        body('age').isInt({min:0}).withMessage('must be positive number'),
        body('password').isString(),
    ]
}
, {
    method: "post",
    route: "/auth/sign-in",
    controller: AuthController,
    action: "login",
    validation:[
        body('firstName').isString(),
        
        body('password').isString(),
    ]
}
]