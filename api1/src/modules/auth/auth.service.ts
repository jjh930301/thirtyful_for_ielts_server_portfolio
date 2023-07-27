import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { TokenType } from 'src/enums/token.type';
import { JwtHelper } from 'src/helpers/jwt.helper';
import { ServiceData } from 'src/models/service.data';
import { RegistUserDto } from './dto/regist.user.dto';
import { UserProvider } from '../user/user.provider';
import { UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userPvd: UserProvider,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  public async regist(body: RegistUserDto): Promise<ServiceData> {
    try {
      const user = await this.userPvd.findByKey('email', body.email);

      if (user) {
        // 탈퇴한 유저는 재가입 불가
        if (user.type === 0) {
          return ServiceData.cannotAccess(' withdrawn user', 4000);
        }

        const accessToken = JwtHelper.createToken(
          user._id,
          user.type,
          TokenType.accessToken,
        );
        const refreshToken = JwtHelper.createToken(
          user._id,
          user.type,
          TokenType.refreshToken,
        );
        return ServiceData.ok(
          'Successfully getting user',
          {
            user: {
              email: user.email,
              display_name: user.display_name,
              profile_image_url: user.profile_image_url,
              type: user.type,
            },
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
          2000,
        );
      }
    } catch (e) {
      return ServiceData.serverError(e);
    }
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();
    try {
      const user = await this.userPvd.createUser(body, session);
      if (!user) throw ServiceData.serverCrudError();
      const accessToken = JwtHelper.createToken(
        user._id,
        user.type,
        TokenType.accessToken,
      );
      const refreshToken = JwtHelper.createToken(
        user._id,
        user.type,
        TokenType.refreshToken,
      );
      user.refresh_token = refreshToken;
      await user.save({ session });
      await session.commitTransaction();
      return ServiceData.dataRegistered(user._id, {
        user: {
          email: user.email,
          display_name: user.display_name,
          profile_image_url: user.profile_image_url,
          type: user.type,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (e) {
      await session.abortTransaction();
      return;
    } finally {
      session.endSession();
    }
  }

  public async user(token: string): Promise<ServiceData> {
    try {
      const verification = await JwtHelper.verify(token, TokenType.accessToken);
      if (!verification) return ServiceData.notAuthorized('[expired token]');
      const user = await this.userPvd.findByKey('_id', verification.id);
      if (user.type === 0) {
        return ServiceData.cannotAccess(' withdrawn user', 4000);
      }
      if (!user) return ServiceData.noModelFound('user');
      return ServiceData.ok('Successfully getting user', {
        user: {
          email: user.email,
          display_name: user.display_name,
          profile_image_url: user.profile_image_url,
          type: user.type,
        },
      });
      return;
    } catch (e) {
      return ServiceData.serverError(e);
    }
  }

  public async token(token: string): Promise<ServiceData> {
    try {
      const verification = await JwtHelper.verify(
        token,
        TokenType.refreshToken,
      );
      if (!verification) return ServiceData.notAuthorized('[expired token]');
      const accessToken = JwtHelper.createToken(
        verification.id,
        verification.type,
        TokenType.accessToken,
      );
      const refreshToken = JwtHelper.createToken(
        verification.id,
        verification.type,
        TokenType.refreshToken,
      );
      const user: UserDocument = await this.userPvd.findByIdAndUpdate(
        verification.id,
        'refresh_token',
        refreshToken,
      );
      if (user.type === 0) {
        return ServiceData.cannotAccess(' withdrawn user', 4000);
      }
      if (!user) return ServiceData.noModelFound('user');
      return ServiceData.ok(
        'Successfully getting tokens',
        {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
        2000,
      );
    } catch (e) {
      return ServiceData.serverError(e);
    }
  }
}
