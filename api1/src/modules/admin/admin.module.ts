import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminAuthenticator } from 'src/middleware/admin.authenticator';
import { PromptProvider } from '../prompt/prompt.provider';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TopicProvider } from '../topic/topic.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      ...PromptProvider.models,
      ...TopicProvider.models,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, PromptProvider, TopicProvider],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminAuthenticator).forRoutes(AdminController);
  }
}
