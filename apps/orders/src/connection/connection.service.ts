import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mysql, { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
import * as connection from 'mysql2/promise';
import { SQLStatement } from 'sql-template-strings';

@Injectable()
export class ConnectionService {
  public masterConnection: connection.Pool;
  public slaveConnection: connection.Pool;
  constructor(configService: ConfigService) {
    this.masterConnection = connection.createPool({
      host: configService.get<string>('MASTER_DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      user: configService.get<string>('DB_USER'),
      database: configService.get<string>('DB_NAME'),
      password: configService.get<string>('DB_PASSWORD'),
  
    });

    this.slaveConnection = connection.createPool({
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

  async masterSQL(
    ...args: any
  ): Promise<
    | RowDataPacket[][]
    | RowDataPacket[]
    | OkPacket
    | OkPacket[]
    | ResultSetHeader
  > {
    let data = [];

    if (typeof args[0] === 'string' && args[1] instanceof Array)
      data = await this.masterConnection.query(args[0], args[1]);
    else if (args[0] instanceof SQLStatement && args[1] instanceof Array)
      data = await this.masterConnection.query(args[0], args[1]);
    else if (args[0] instanceof SQLStatement && args[1] === undefined)
      data = await this.masterConnection.query(args[0]);

    return data[0];
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

  async slaveSQL(
    ...args: any
  ): Promise<
    | RowDataPacket[][]
    | RowDataPacket[]
    | OkPacket
    | OkPacket[]
    | ResultSetHeader
  > {
    let data = [];

    if (typeof args[0] === 'string' && args[1] instanceof Array)
      data = await this.slaveConnection.query(args[0], args[1]);
    else if (args[0] instanceof SQLStatement && args[1] instanceof Array)
      data = await this.slaveConnection.query(args[0], args[1]);
    else if (args[0] instanceof SQLStatement && args[1] === undefined)
      data = await this.slaveConnection.query(args[0]);

    return data[0];
  }
}
