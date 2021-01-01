import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

var cors = require('cors')

class App {
  private app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.enableCORS();
    this.initializeMiddlewares();
    this.initializeLogger();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private static loggerMiddleware(request: express.Request, response: express.Response, next: () => void) {
    console.log(`${request.method} ${request.path} ${response.statusCode}`);
    next();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private enableCORS() {
    this.app.use(cors({
      exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', 'Set-Cookie', 'test', 'Authorization']
    }))
    // this.app.use(function (req, res, next) {
    //   res.header('Access-Control-Allow-Origin', '*');
    //   res.header('Access-Control-Allow-Credentials', 'true');
    //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //   next();
    // });
  }

  private initializeLogger() {
    this.app.use(App.loggerMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
}

export default App;