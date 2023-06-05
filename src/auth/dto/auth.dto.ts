import { IsEmail, IsInt, IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email : string;

    @IsString()
    @IsNotEmpty()
    password : string
}