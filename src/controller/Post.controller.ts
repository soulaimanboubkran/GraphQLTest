import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Post } from "../entity/Post";
import { User } from "../entity/User";

export interface CreatePostRequestBody {
    title: string;
    body: string;
    userId: number;
}

export class PostController {
    private postRepo = AppDataSource.getRepository(Post);
    private userRepo = AppDataSource.getRepository(User);

    async save(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { title, body, userId }: CreatePostRequestBody = req.body;

            const author = await this.userRepo.findOneBy({ id: userId });
            if (!author) {
                throw new Error('Author not found');
            }

            const newPost = Object.assign(new User(), {
                title,
                body,
                author
            });
            await this.postRepo.save(newPost);

            res.status(201).json(newPost);
        } catch (error) {
            next(error);
        }
    }
    async all(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const posts = await this.postRepo.find({ relations: ["author"] });
            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }
}
