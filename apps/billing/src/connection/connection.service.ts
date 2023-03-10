import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mysql, { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
import * as connection from 'mysql2/promise';
import { SQLStatement } from 'sql-template-strings';

@Injectable()
export class ConnectionService {
  public masterConnection: connection.Pool;
  public slaveConnection: connection.Pool;
  constructor(
  private configService:ConfigService
    ) {
    
    this.masterConnection = connection.createPool({
      host: this.configService.get<string>('MASTER_DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USER'),
      database: this.configService.get<string>('DB_NAME'),
      password: this.configService.get<string>('DB_PASSWORD'),

    });

    this.slaveConnection = connection.createPool({
      host: this.configService.get<string>('SLAVE1_DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USER'),
      database: this.configService.get<string>('DB_NAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
   
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
    const conn = await this.slaveConnection.getConnection();
    const [results, fields] = await conn.query(rawQuery, params);
    conn.release();
    return results;
  }
}
