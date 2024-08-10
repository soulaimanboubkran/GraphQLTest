"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
class UserController {
    userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    async all(request, response, next) {
        return this.userRepository.find();
    }
    async one(request, response, next) {
        const id = parseInt(request.params.id);
        const user = await this.userRepository.findOne({
            where: { id }
        });
        if (!user) {
            return "unregistered user";
        }
        return user;
    }
    async save(request, response, next) {
        const { firstName, lastName, age } = request.body;
        const user = Object.assign(new User_1.User(), {
            firstName,
            lastName,
            age
        });
        return this.userRepository.save(user);
    }
    async remove(request, response, next) {
        const id = parseInt(request.params.id);
        let userToRemove = await this.userRepository.findOneBy({ id });
        if (!userToRemove) {
            return "this user not exist";
        }
        await this.userRepository.remove(userToRemove);
        return "user has been removed";
    }
}
exports.UserController = UserController;
