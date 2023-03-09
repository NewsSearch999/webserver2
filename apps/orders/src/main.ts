import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { OrdersModule } from './orders.module';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('SUPER ORDER API DOCUMENT')
    .setDescription('Super order API문서 입니다')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(3000);
  console.log('3000 만큼 사랑해');
}
bootstrap();
