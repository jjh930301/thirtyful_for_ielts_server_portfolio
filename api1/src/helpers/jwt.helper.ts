import { JwtService } from "@nestjs/jwt";
import { Constants } from "src/constants/constants";
import { TokenType } from "src/enums/token.type";

export class JwtHelper {

  static jwtService = (type) : JwtService => {
    let option : Object = null;
    if (type === TokenType.accessToken) {
      option = { 
        expiresIn: 3600 * 24, // access token
        issuer: 'ttf' , 
        algorithm : "HS256"
      }
    } else if(type === TokenType.refreshToken){ // refresh token
      option = { 
        issuer: 'ttf' , 
        algorithm : "HS512"
      }
    }
    return new JwtService({
      secret: type === TokenType.accessToken ? 
        Constants.ACCESS_SECRET : 
        Constants.REFRESH_SECRET,
      signOptions: option,
    })
  };

  static createToken = (
    id: string, 
    type : number,
    tokenType : number
  ): string => {
    const payload = {
      id: id,
      type : type
    };

    const token = this.jwtService(tokenType).sign(payload);
    return token;
  };

  static verify = (
    token: string,
    tokenType : number
  ): any => {
    try {
      const bearer = token.split("Bearer ")
      const data = this.jwtService(tokenType).verify(
        bearer.length === 2 ? bearer[1] : bearer[0], 
        {
          secret: tokenType === TokenType.accessToken ? 
            Constants.ACCESS_SECRET : 
            Constants.REFRESH_SECRET,
        }
      );

      return {
        id: data.id,
        type: data.type,
        status_code: 200,
      };
    } catch (e) {
      return {
        id: null,
        type: null,
        status_code: 401,
      };
    }
  };
}