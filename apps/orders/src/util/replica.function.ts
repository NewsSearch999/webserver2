import { forwardRef, Inject } from "@nestjs/common";
import { OrdersService } from "../orders.service";

export class ReplicaFunction {
    constructor(
        @Inject(forwardRef(() => OrdersService))
        private readonly ordersService: OrdersService,
      ) {}
    
    private x = 0;
  
    replicaBalancing() {
      switch (this.x) {
        case 0:
          this.x = 1;
          return 'salveQuery1';
  
        case 1:
          this.x = 0;
          return 'slaveQuery2';
      }
    }

  }