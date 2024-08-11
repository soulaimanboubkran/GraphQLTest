import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { secret } from "../config";

export class AuthController {
  private userRepo = AppDataSource.getRepository(User);

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {

     try {
        const { firstName, lastName, age, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.age = age;
        user.password = hashedPassword;
  
        await this.userRepo.save(user);

        res.status(201).json({ message: "User registered successfully" });
     } catch (error) {
        next(error)
     }
}

async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, password } = req.body;

      // Find the user
      const user = await this.userRepo.findOne({ where: { firstName } });
      if (!user) {
      throw new Error('Invalid credentials');

      }

      // Check the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Create and send JWT token
      const token = jwt.sign({ id: user.id }, secret!, { expiresIn: '1d' });
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

}