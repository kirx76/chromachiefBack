import {IsString} from "class-validator";

export default class CreateUserDto {
  @IsString()
  public userName: string;

  @IsString()
  public password: string;
}
