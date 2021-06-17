import HttpException from './HttpException';

export default class PostNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Tag with id ${id} not found`);
  }
}
