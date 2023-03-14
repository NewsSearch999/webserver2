import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
import * as connection from 'mysql2/promise';

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
      // charset: 'utf8mb4'
    });

    this.slave1Connection = connection.createPool({
      host: configService.get<string>('SLAVE1_DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      user: configService.get<string>('DB_USER'),
      database: configService.get<string>('DB_NAME'),
      password: configService.get<string>('DB_PASSWORD'),
      // charset: 'utf8mb4'
    });

    this.slave2Connection = connection.createPool({
      host: configService.get<string>('SLAVE2_DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      user: configService.get<string>('DB_USER'),
      database: configService.get<string>('DB_NAME'),
      password: configService.get<string>('DB_PASSWORD'),
      // charset: 'utf8mb4'
    });
  }

  async replicaConnectionBalancing(){
    switch(this.x){
      case 0:
        this.x = 1;
        const conn1 = await this.slave1Connection.getConnection();
        return conn1
      case 1:
        this.x = 0;
        const conn2 = await this.slave2Connection.getConnection();
        return conn2
    }
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
}
