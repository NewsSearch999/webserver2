import { TypeOrmModule } from '@nestjs/typeorm';

import * as path from 'path';

export function getPgRealTypeOrmModule() {
  const entityPath = path.join(__dirname, 'src/domain/**/*.entity.ts');
  return TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1234',
    database: 'test',
    entities: [entityPath],
    synchronize: true,
    logging: false,
  });
}
