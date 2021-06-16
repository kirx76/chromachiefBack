import {IsString} from "class-validator";

export default class LoginDto {
  @IsString()
  public userName: string;

  @IsString()
  public password: string;
}
