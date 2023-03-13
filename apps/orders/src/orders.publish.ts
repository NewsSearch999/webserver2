import { RabbitmqChannelProvider } from "@app/common/rmq/rmq.connection";
import { Injectable } from "@nestjs/common";


@Injectable()
export class OrdersPublish {
    private channel: any;
    private x = 1;
    constructor(
        private readonly rabbitmqChannelProvider: RabbitmqChannelProvider
    ){

    }
    async publishOrder(request: object) {
        const balancing = () => {
            switch (this.x) {
              case 1:
                this.x = 2;
                return this.x;
              case 2:
                this.x = 1;
                return this.x
            }
          };
          const num = balancing()
          this.channel = await this.rabbitmqChannelProvider.createChannel();
          this.channel.publish(
            `exchange${num}`,
            `exchange${num}.billing${num}`,
            Buffer.from(JSON.stringify(request)),
          );
    }

    async publishPayment(request: object) {
        const balancing = () => {
            switch (this.x) {
              case 1:
                this.x = 2;
                return this.x;
              case 2:
                this.x = 1;
                return this.x
            }
          };
          const num = balancing()
          this.channel = await this.rabbitmqChannelProvider.createChannel();
          this.channel.publish(
            `exchange${num}`,
            `exchange${num}.payment${num}`,
            Buffer.from(JSON.stringify(request)),
          );
    }


}