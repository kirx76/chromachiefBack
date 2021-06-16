import HttpException from './HttpException';

class UserWithThatUserNameAlreadyExistsException extends HttpException {
  constructor(userName: string) {
    super(400, `User with user name ${userName} already exists`);
  }
}

export default UserWithThatUserNameAlreadyExistsException;
