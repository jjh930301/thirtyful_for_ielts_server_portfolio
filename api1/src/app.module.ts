import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.check.controller';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { PromptModule } from './modules/prompt/prompt.module';
import { TopicModule } from './modules/topic/topic.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@${
        process.env.DB_HOST
      }/${
        process.env.ENV == 'production'
          ? process.env.DB_NAME
          : process.env.DB_NAME
      }`, // ?authSource=admin
    ),
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
      },
      {
        path: 'auth',
        module: AuthModule,
      },
      {
        path: 'user',
        module: UserModule,
      },
      {
        path: 'prompt',
        module: PromptModule,
      },
      {
        path: 'topic',
        module: TopicModule,
      },
    ]),
    AdminModule,
    AuthModule,
    UserModule,
    PromptModule,
    TopicModule,
    TerminusModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
