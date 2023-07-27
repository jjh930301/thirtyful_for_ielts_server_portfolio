import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Authenticator } from 'src/middleware/authenticator';
import { ConversationProvider } from '../conversation/conversation.provider';
import { PromptProvider } from '../prompt/prompt.provider';
import { QuestionProvider } from '../question/question.provider';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TopicProvider } from './topic.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      ...ConversationProvider.models,
      ...QuestionProvider.models,
      ...PromptProvider.models,
      ...TopicProvider.models,
    ]),
  ],
  controllers: [TopicController],
  providers: [
    TopicService,
    ConversationProvider,
    QuestionProvider,
    PromptProvider,
    TopicProvider,
  ],
})
export class TopicModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Authenticator).forRoutes(TopicController);
  }
}
