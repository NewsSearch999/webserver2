import { forwardRef, Inject } from "@nestjs/common";
import { OrdersService } from "../orders.service";
// export class ExchangeFunction {
//     exchangeBalancing() {
//         let array = ['exchange1', 'exchange2']
//         let idx = (Math.random()>=0.5)? 1 : 0;   
//       return array[idx]
//   }
//   }

export class ExchangeFunction {
    constructor(
        @Inject(forwardRef(() => OrdersService))
        private readonly ordersService: OrdersService,
      ) {}
    
    private x = 0;
  
    exchangeBalancing() {
      switch (this.x) {
        case 0:
          this.x = 1;
          return ["exchange1", "billing1", "payment1"];
  
        case 1:
          this.x = 0;
          return ["exchange2", "billing2", "payment2"];
      }
    }

  }