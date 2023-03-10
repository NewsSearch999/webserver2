import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { OrdersModule } from './orders.module';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('SUPER ORDER API DOCUMENT') //API 문서 타이틀 입니다
    .setDescription('Super order API문서 입니다') //타이틀 아래 설명란에 들어갈 항목입니다.
    .setVersion('1.0') //제목 옆에 버전을 명시할수 있습니다.
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document); //setup의 첫번째 파라미터로 API문서 경로를 설정할 수 있습니다.
  app.enableCors();
  await app.listen(3000);
  console.log('3000 만큼 사랑해');
}
bootstrap();
