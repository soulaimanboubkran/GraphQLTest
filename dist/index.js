"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const data_source_1 = require("./data-source");
const routes_1 = require("./routes");
const User_1 = require("./entity/User");
data_source_1.AppDataSource.initialize().then(async () => {
    // create express app
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    // register express routes from defined application routes
    routes_1.Routes.forEach(route => {
        app[route.method](route.route, (req, res, next) => {
            const result = (new route.controller)[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
            }
            else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });
    // setup express app here
    // ...
    // start express server
    app.listen(3000);
    // insert new users for test
    await data_source_1.AppDataSource.manager.save(data_source_1.AppDataSource.manager.create(User_1.User, {
        firstName: "Timber",
        lastName: "Saw",
        age: 27
    }));
    await data_source_1.AppDataSource.manager.save(data_source_1.AppDataSource.manager.create(User_1.User, {
        firstName: "Phantom",
        lastName: "Assassin",
        age: 24
    }));
    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");
}).catch(error => console.log(error));
