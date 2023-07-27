import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtHelper } from 'src/helpers/jwt.helper';


@Injectable()
export class Authenticator implements NestMiddleware {

  async use(req: any, res: any, next: () => void): Promise<any> {
    try {
      const token = req.headers.authorization;
      if (!token) {
        res.status(419).send({
          message: ["Cannot Access[Token is not exists]"],
          payload: {result : null},
          resultCode : 4004,
        });
      }
      const verification = JwtHelper.verify(token , 0)

      //Token is expired
      if (verification.statusCode === 401) {
        return res.status(401).send({
          message: [`authentication is expired[Required create new token]`],
          payload: {result : null},
          resultCode: 4019
        })
      }
      if (verification.status_code == 200) {
        req.user = {
          id : verification.id,
          type : verification.type
        };
        next();
        return;
      } else {
        return res.status(403).send({
          message: ["Cannot Access[Unknown]"],
          payload: {result : null},
          resultCode : 5000,
        })
      }
    } catch (e) {
      console.log(e)
      throw (e);
    }
  }
}
