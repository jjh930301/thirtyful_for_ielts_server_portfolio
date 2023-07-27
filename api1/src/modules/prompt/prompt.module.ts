import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminAuthenticator } from 'src/middleware/admin.authenticator';
import { Authenticator } from 'src/middleware/authenticator';
import { PromptController } from './prompt.controller';
import { PromptProvider } from './prompt.provider';
import { PromptService } from './prompt.service';

@Module({
  imports : [
    MongooseModule.forFeature([
      ...PromptProvider.models
    ])
  ],
  controllers: [PromptController],
  providers: [
    PromptService,
    PromptProvider
  ]
})
export class PromptModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Authenticator).forRoutes(PromptController)
  }
}
