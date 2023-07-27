import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Constants } from './constants/constants';
import { setupSwagger } from './setup.swagger';
import { Exceptions } from './utils/exceptions';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new Exceptions());
  
  // if(Constants.ENV === "development" || Constants.ENV === "dev") 
  setupSwagger(app);
  app.enableCors();
  await app.listen(3030);
}
bootstrap();
