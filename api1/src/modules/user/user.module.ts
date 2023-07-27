import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Authenticator } from 'src/middleware/authenticator';
import { ConversationProvider } from '../conversation/conversation.provider';
import { UserController } from './user.controller';
import { UserProvider } from './user.provider';
import { UserService } from './user.service';

@Module({
  imports : [
    MongooseModule.forFeature([
      ...UserProvider.models,
      ...ConversationProvider.models
    ])
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserProvider,
    ConversationProvider
  ]
})
export class UserModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Authenticator).forRoutes(UserController)
  }
}
