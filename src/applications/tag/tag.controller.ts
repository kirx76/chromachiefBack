import Controller from "../../interfaces/controller.interface";
import express from "express";
import {getRepository} from "typeorm";
import Tag from "./tag.entity";
import CreateTagDto from "./tag.dto";
import validationMiddleware from "../../middleware/validation.middleware";
import TagNotFoundException from "../../exceptions/TagNotFoundException";
import RequestWithUser from "../../interfaces/requestWithUser.interface";
import authMiddleware from "../../middleware/auth.middleware";

export default class TagController implements Controller {
  public path = '/tags';
  public router = express.Router();
  private tagRepository = getRepository(Tag);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(this.path, this.getAllTags)
    this.router
      .post(this.path, authMiddleware, validationMiddleware(CreateTagDto), this.createTag)
      .get(`${this.path}/:id`, this.getTagById)
  }

  private getAllTags = async (request: express.Request, response: express.Response) => {
    console.log('getAllTags')
    const tags = await this.tagRepository.find({relations: ['author']});
    response.send(tags);
  }

  private createTag = async (request: RequestWithUser, response: express.Response) => {
    console.log('createTag')
    const tagData: CreateTagDto = request.body;
    const newTag = this.tagRepository.create({
      ...tagData,
      author: request.user
    });
    await this.tagRepository.save(newTag);
    response.send(newTag);
  }

  private getTagById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log('getTagById')
    const id = request.params.id;
    const tag = await this.tagRepository.findOne(id);
    if (tag) {
      response.send(tag);
    } else {
      next(new TagNotFoundException(id));
    }
  }
}
