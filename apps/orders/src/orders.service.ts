import { Injectable } from '@nestjs/common';
import { ConnectionService } from './connection/connection.service';

@Injectable()
export class OrdersService {
  constructor(
    private connectionService: ConnectionService,
  ){}


  
}
