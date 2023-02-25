// import { DataSource, DataSourceOptions } from 'typeorm';
// import { runSeeders, SeederOptions } from 'typeorm-extension';
// import { Product } from './src/product.entity';

// const options : DataSourceOptions & SeederOptions = {
//   type: 'mysql',
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: 3306,
//   username: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '10091011',
//   database: process.env.DB_NAME || 'orderproject',
//   entities: [Product],
//   // charset: 'utf8mb4',
//   synchronize: false,
//   logging: true,
//   seeds: ['src/database/seeds/*{.ts,.js}'],
//   factories: ['src/database/factories/*{.ts,.js}']
// };


// export const dataSource = new DataSource(options);

// (async ()=>{

//   await dataSource.initialize();
//   await runSeeders(dataSource);
  
// })();


