import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import AuthenticationService from './authentication.service';
import LogInDto from "./logIn.dto";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import {getRepository} from "typeorm";
import User from "../user/user.entity";
import * as jwt from "jsonwebtoken";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.login);
    this.router.get(`${this.path}/me`, this.me);
  }

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = request.body;
    try {
      const {
        cookie,
        user,
      } = await this.authenticationService.register(userData);
      response.setHeader('Set-Cookie', [cookie]);
      response.send(user);
    } catch (error) {
      next(error);
    }
  }

  private login = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const loginData: LogInDto = request.body;
    try {
      const {user, key} = await this.authenticationService.logining(loginData);
      response.setHeader('authorization', key)
      response.send(user);
    } catch (error) {
      next(new WrongCredentialsException());
    }
  }

  private me = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    if (request.headers?.authorization) {
      const {authorization} = request.headers;
      const userRepository = getRepository(User);
      if (authorization) {
        const secret = process.env.JWT_SECRET;
        try {
          const verificationResponse = jwt.verify(authorization, secret) as DataStoredInToken;
          const id = verificationResponse.id;
          const user = await userRepository.findOne(id);
          if (user) {
            user.password = undefined;
            response.send(user);
          } else {
            next(new WrongAuthenticationTokenException());
          }
        } catch (err) {
          next(new WrongAuthenticationTokenException());
        }
      } else {
        next(new AuthenticationTokenMissingException());
      }
    } else {
      next(new AuthenticationTokenMissingException());
    }
  }
}

export default AuthenticationController;