import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const setupSwagger = (app : INestApplication) : void => {
  const options = new DocumentBuilder()
  .setTitle("thirtyful doc")
  .setDescription(``)
  .addBearerAuth({
    name : 'authentication',
    type : 'http',
    in : 'header'
  } , 'user')
  .addApiKey({
    type : 'apiKey',
    name : 'secret',
    in : 'header'
  } , 'admin')
  .build()

  const document = SwaggerModule.createDocument(app , options);
  SwaggerModule.setup('docs' , app , document);
}