import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
import * as connection from 'mysql2/promise';

@Injectable()
export class ConnectionService {
  public masterConnection: connection.Pool;
  public slaveConnection1: connection.Pool;
  public slaveConnection2: connection.Pool;
  constructor(
    configService: ConfigService
    )
     {
    
    this.masterConnection = connection.createPool({
      host: configService.get<string>('MASTER_DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      user: configService.get<string>('DB_USER'),
      database: configService.get<string>('DB_NAME'),
      password: configService.get<string>('DB_PASSWORD'),
  
    });

    this.slaveConnection1 = connection.createPool({
      host: configService.get<string>('SLAVE1_DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      user: configService.get<string>('DB_USER'),
      database: configService.get<string>('DB_NAME'),
      password: configService.get<string>('DB_PASSWORD'),
    });

    this.slaveConnection2 = connection.createPool({
      host: configService.get<string>('SLAVE1_DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      user: configService.get<string>('DB_USER'),
      database: configService.get<string>('DB_NAME'),
      password: configService.get<string>('DB_PASSWORD'),
    });
  }
  

  async masterQuery(
    rawQuery: string,
    params: any[],
  ): Promise<
    | RowDataPacket[][]
    | RowDataPacket[]
    | OkPacket
    | OkPacket[]
    | ResultSetHeader
  > {
    const conn = await this.masterConnection.getConnection();
    const [results, fields] = await conn.query(rawQuery, params);
    conn.release();
    return results;
  }

  async slaveQuery(
    rawQuery: string,
    params: any[],
  ): Promise<
    | RowDataPacket[][]
    | RowDataPacket[]
    | OkPacket
    | OkPacket[]
    | ResultSetHeader
  > {
    const conn = await this.slaveConnection1.getConnection();
    const [results, fields] = await conn.query(rawQuery, params);
    conn.release();
    return results;
  }

}
