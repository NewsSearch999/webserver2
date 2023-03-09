import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mysql, { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
import * as connection from 'mysql2/promise';
import { SQLStatement } from 'sql-template-strings';

@Injectable()
export class ConnectionService {
  public masterConnection: connection.Pool;
  public slave1Connection: connection.Pool;
  public slave2Connection: connection.Pool;
  private x = 0;
  constructor(configService: ConfigService) {
    this.masterConnection = connection.createPool({
      host: configService.get<string>('MASTER_DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      user: configService.get<string>('DB_USER'),
      database: configService.get<string>('DB_NAME'),
      password: configService.get<string>('DB_PASSWORD'),
      connectionLimit: 500,
    });

    this.slave1Connection = connection.createPool({
      host: configService.get<string>('SLAVE1_DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      user: configService.get<string>('DB_USER'),
      database: configService.get<string>('DB_NAME'),
      password: configService.get<string>('DB_PASSWORD'),
      connectionLimit: 500,
    });

    this.slave2Connection = connection.createPool({
      host: configService.get<string>('SLAVE2_DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      user: configService.get<string>('DB_USER'),
      database: configService.get<string>('DB_NAME'),
      password: configService.get<string>('DB_PASSWORD'),
      connectionLimit: 500,
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
    switch (this.x) {
      case 0:
        this.x = 1;
        const conn1 = await this.slave1Connection.getConnection();
        const [results1, fields1] = await conn1.query(rawQuery, params);
        conn1.release();
        return results1;

      case 1:
        this.x = 0;
        const conn2 = await this.slave2Connection.getConnection();
        const [results2, fields2] = await conn2.query(rawQuery, params);
        conn2.release();
        return results2;
    }
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
    switch (this.x) {
      case 0:
        this.x = 1;
        if (typeof args[0] === 'string' && args[1] instanceof Array)
          data = await this.slave1Connection.query(args[0], args[1]);
        else if (args[0] instanceof SQLStatement && args[1] instanceof Array)
          data = await this.slave1Connection.query(args[0], args[1]);
        else if (args[0] instanceof SQLStatement && args[1] === undefined)
          data = await this.slave1Connection.query(args[0]);
        return data[0];

      case 1:
        this.x = 0;
        if (typeof args[0] === 'string' && args[1] instanceof Array)
          data = await this.slave1Connection.query(args[0], args[1]);
        else if (args[0] instanceof SQLStatement && args[1] instanceof Array)
          data = await this.slave1Connection.query(args[0], args[1]);
        else if (args[0] instanceof SQLStatement && args[1] === undefined)
          data = await this.slave1Connection.query(args[0]);
        return data[0];
    }
  }
}
