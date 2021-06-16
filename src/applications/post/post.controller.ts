import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import {getRepository} from "typeorm";
import Post from "./post.entity";
import CreatePostDto from "./post.dto";
import validationMiddleware from "../../middleware/validation.middleware";
import PostNotFoundException from "../../exceptions/PostNotFoundException";
import RequestWithUser from "../../interfaces/requestWithUser.interface";
import authMiddleware from "../../middleware/auth.middleware";

export default class PostController implements Controller {
  public path = '/posts'
  public router = express.Router();
  private postRepository = getRepository(Post);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(this.path, this.getAllPosts)
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .get(`${this.path}/:id`, this.getPostById)
      .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.patchPost)
      .delete(`${this.path}/:id`, this.deletePost)
  }

  private getAllPosts = async (request: express.Request, response: express.Response) => {
    console.log('getAllPosts')
    const posts = await this.postRepository.find();
    response.send(posts);
  }

  private createPost = async (request: RequestWithUser, response: express.Response) => {
    console.log('createPost')
    const postData: CreatePostDto = request.body;
    const newPost = this.postRepository.create({
      ...postData,
      author: request.user
    });
    await this.postRepository.save(newPost);
    response.send(newPost);
  }

  private patchPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log('patchPost')
    const id = request.params.id;
    const postData: Post = request.body;
    await this.postRepository.update(id, postData);
    const updatedPost = await this.postRepository.findOne(id);
    if (updatedPost) {
      response.send(updatedPost)
    } else {
      next(new PostNotFoundException(id))
    }
  }

  private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log('getPostById')
    const id = request.params.id;
    const post = await this.postRepository.findOne(id, {relations: ['author']});
    if (post) {
      response.send(post)
    } else {
      next(new PostNotFoundException(id))
    }
  }

  private deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log('deletePost')
    const id = request.params.id;
    const content = await this.postRepository.delete(id)
    if (content.affected > 0) {
      response.sendStatus(200);
    } else {
      next(new PostNotFoundException(id))
    }
  }
}
