import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import Controller from "../../interfaces/controller.interface";
import express from "express";
import {getRepository} from "typeorm";
import User from "./user.entity";
import CreateUserDto from "./user.dto";
import validationMiddleware from "../../middleware/validation.middleware";
import UserWithThatUserNameAlreadyExistsException from "../../exceptions/UserWithThatUserNameAlreadyExistsException";
import TokenData from "../../interfaces/tokenData.interface";
import DataStoredInToken from "../../interfaces/dataStoredInToken";
import LoginDto from "./login.dto";
import WrongCredentialsException from "../../exceptions/WrongCredentialsException";
import authMiddleware from "../../middleware/auth.middleware";
import RequestWithUser from "../../interfaces/requestWithUser.interface";
import PostNotFoundException from "../../exceptions/PostNotFoundException";


export default class UserController implements Controller {
  public path = '/user';
  public router = express.Router();
  private userRepository = getRepository(User);

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router
      .get(this.path, authMiddleware, this.getMe)
      .put(this.path, authMiddleware, this.updateUser)
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private updateUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
    const userData: Partial<User> = request.body;
    console.log(userData, request.user)
    await this.userRepository.update(request.user.id, userData)
    const updatedUser = await this.userRepository.findOne(request.user.id);
    if (updatedUser) {
      response.send({...updatedUser, password: undefined})
    } else {
      next(new PostNotFoundException(request.user.id as unknown as string))
    }
  }

  private getMe = async (request: RequestWithUser, response: express.Response) => {
    console.log('getMe')
    // @ts-ignore
    const user = {...request.user, password: undefined};
    response.send(user);
  }

  private getAllUsers = async (request: express.Request, response: express.Response) => {
    console.log('getAllUsers')
    const users = await this.userRepository.find();
    const out = users.map(user => {
      return {...user, password: undefined}
    })
    response.send(out);
  }

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = request.body;
    if (await this.userRepository.findOne({userName: userData.userName})) {
      next(new UserWithThatUserNameAlreadyExistsException(userData.userName));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = this.userRepository.create({
        ...userData,
        password: hashedPassword
      });
      await this.userRepository.save(newUser);
      newUser.password = undefined;
      const tokenData = this.createToken(newUser);
      response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
      response.send(newUser);
    }
  }

  private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const logInData: LoginDto = request.body;
    const user = await this.userRepository.findOne({userName: logInData.userName});
    if (user) {
      const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
      if (isPasswordMatching) {
        user.password = undefined;
        const tokenData = this.createToken(user);
        response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        response.setHeader('Authorization', [this.createHeader(tokenData)]);
        response.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }

  private loggingOut = (request: express.Request, response: express.Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.setHeader('Authorization', ['']);
    response.sendStatus(200);
  }

  private createToken = (user: User): TokenData => {
    const expiresIn = 60 * 60;
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      id: user.id
    }
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, {expiresIn})
    }
  }

  private createCookie = (tokenData: TokenData): string => {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/;`;
  }

  private createHeader = (tokenData: TokenData): string => tokenData.token;
}
