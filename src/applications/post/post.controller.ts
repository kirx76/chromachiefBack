import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import {getRepository} from "typeorm";
import Post from "./post.entity";
import CreatePostDto from "./post.dto";
import validationMiddleware from "../../middleware/validation.middleware";
import PostNotFoundException from "../../exceptions/PostNotFoundException";
import RequestWithUser from "../../interfaces/requestWithUser.interface";
import authMiddleware from "../../middleware/auth.middleware";
import Tag from "../tag/tag.entity";
import CreateTagDto from "../tag/tag.dto";

export default class PostController implements Controller {
  public path = '/posts'
  public router = express.Router();
  private postRepository = getRepository(Post);
  private tagRepository = getRepository(Tag);

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
    const posts = await this.postRepository.find({relations: ['author', 'tags']});
    response.send(posts);
  }

  private createPost = async (request: RequestWithUser, response: express.Response) => {
    console.log('createPost', request.body)
    const postData: CreatePostDto = request.body;
    const tagsData: CreateTagDto = request.body?.tags;
    let tagsFinded;
    if (Array.isArray(tagsData)) {
      const currentTags = await this.tagRepository.find()
      console.log(currentTags, 'currentTag')
      const existedTags = currentTags.filter((tag: Tag) => {
        console.log(tag, tagsData.includes(tag))
        return tagsData.includes(tag)
      })
      console.log(existedTags, ['existedTags'])
      // const existedTags = async () => {
      //   return tagsData.map(async (tag) => {
      //     const currentTag = await this.tagRepository.find({name: tag.name})
      //     console.log(currentTag, "R")
      //     return currentTag
      //   })
      // }
      // existedTags().then(r=>{
      //   console.log(r, 'SS')
      // })
      // console.log(await existedTags(), 'existedTags')
      // tagsFinded = tagsData.map(tag => this.tagRepository.findOne({name: tag.name}).then(r => {
      //   console.log(r, 'R')
      //   return r
      // }))
    }
    // const tagsFinded = tagsData.
    console.log(tagsFinded, 'lol')
    const newPost = this.postRepository.create({
      ...postData,
      author: request.user,
      // tags: tagsData
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
    const post = await this.postRepository.findOne(id, {relations: ['author', 'tags']});
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
