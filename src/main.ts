import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  var dirPath = path.join(
    process.cwd(),
    process.env.GENERATED_FILES_DIR ?? '',
  );
  // if (!fs.existsSync(dirPath)) {
  //   fs.mkdirSync(dirPath, { recursive: true });
  // }
  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('The authentication API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
 
  SwaggerModule.setup('', app, document,);
  //disable cors
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
