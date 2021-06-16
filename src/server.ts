import 'dotenv/config';
import 'reflect-metadata';
import {createConnection} from 'typeorm';
import App from './app';
import config from './ormconfig';
import validateEnv from './utils/validateEnv';
import PostController from "./applications/post/post.controller";
import UserController from "./applications/user/user.controller";

validateEnv();

(async () => {
  try {
    const connection = await createConnection(config);
    console.log('CONNECTED TO DB')
    await connection.runMigrations();
  } catch (error) {
    console.log('Error while connecting to the database', error);
    return error;
  }
  const app = new App(
    [
      new PostController(),
      new UserController(),
    ],
  );
  app.listen();
})();
