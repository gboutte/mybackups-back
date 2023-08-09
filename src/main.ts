import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Every property that is not in the DTO will be removed
      forbidNonWhitelisted: true, // If a property is not in the DTO an error will be thrown because it is not allowed
      transform: true, // Transform the payload into the DTO class, without this option the payload will be a simple object with the shape of the DTO class but won't be an instance of the DTO class.
      transformOptions: {
        enableImplicitConversion: true, // Convert the type primitive type like number and boolean to the right type without having to specify it with @Type decorator
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('MyBackups api')
    .setDescription('MyBackups api')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: 'You can get the token on the /auth/login endpoint',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
      docExpansion: 'none',
      filter: true,
      syntaxHighlight: {
        activate: true,
        theme: 'tomorrow-night',
      },
      tryItOutEnabled: true,
    },
  });

  await app.listen(3000);
}

bootstrap();
