import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProvider } from '../user/user.provider';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports : [
    MongooseModule.forFeature([
      ...UserProvider.models
    ])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserProvider
  ]
})
export class AuthModule {}
