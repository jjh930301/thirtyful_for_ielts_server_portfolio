import { Injectable, NestMiddleware } from "@nestjs/common";
import { TokenType } from "src/enums/token.type";
import { JwtHelper } from "src/helpers/jwt.helper";

@Injectable()
export class AdminAuthenticator implements NestMiddleware {
  async use(req: any, res: any, next: (error?: any) => void) {
    try {
      const token = req.headers.secret

      if(!token) {
        res.status(419).send({
          message: ["Cannot Access[Token is not exists]"],
          payload: {result : null},
          resultCode : 4004,
        });
      }
      if (token === process.env.ADMIN_KEY) {
        next();
      } else {
        return res.status(403).send({
          message: ["Cannot Access[Unknown]"],
          payload: {result : null},
          resultCode : 5000,
        })
      }
    } catch(e) {
      throw e
    }
  }
}