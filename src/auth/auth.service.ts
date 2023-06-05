import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()

export class AuthService {

    constructor(
      private prisma : PrismaService,
      private jwt: JwtService,
      private config: ConfigService
      ) {
      //
    }

    signUp = async (dto : AuthDto) => {
      
      try {
        const hash = await argon.hash(dto.password);
        const user = await this.prisma.user.create({
          data : {
            email : dto.email,
            hash,
            // firstName:dto.first_name,
            // lastName:dto.last_name
          }
        })
      
        return this.signToken(user.id,user.email);

      } catch (error) {
        // if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2002') {
            throw new ForbiddenException('Credentials taken !')
          }
        // }
        throw error;
      }
      
    }

    logIn = async (dto : AuthDto) => {

      const user = await this.prisma.user.findUnique({
        where : {
          email : dto.email
        }
      })

      if (!user) throw new ForbiddenException("User not found !") ;

      const passwordMatch = await argon.verify(user.hash,dto.password);

      if (!passwordMatch) {
        throw new ForbiddenException("Incorrect password !");
      }

      const api_token = await this.signToken(user.id,user.email);

      return {
        ...user,
        api_token
      };

    }

    signToken = async (userId: number, email : string) : Promise<string> => {
      
      const payload = {
        sub : userId,
        email
      };

      const token = await this.jwt.signAsync(payload,{
        expiresIn : "15m",
        secret: this.config.get('JWT_SECRET')
      });

      return token;

    } 
}
