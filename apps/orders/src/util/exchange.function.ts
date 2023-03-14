// import { forwardRef, Inject } from "@nestjs/common";
// import { OrdersService } from "../orders.service";

// export class ExchangeFunction {
//     constructor(
//         @Inject(forwardRef(() => OrdersService))
//         private readonly ordersService: OrdersService,
//       ) {}
    
//     private x = 0;
  
//     exchangeBalancing() {
//       switch (this.x) {
//         case 0:
//           this.x = 1;
//           return ["exchange1", "billing1", "payment1"];
  
//         case 1:
//           this.x = 0;
//           return ["exchange2", "billing2", "payment2"];
         
//         default:
//           return ["exchange1", "billing1", "payment1"];
//       }
//     }

//   }