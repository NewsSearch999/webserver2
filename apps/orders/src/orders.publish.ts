import { RabbitmqChannelProvider } from "@app/common/rmq/rmq.connection";
import { Injectable } from "@nestjs/common";
import { Channel } from 'amqplib';

@Injectable()
export class OrdersPublish {
    private channel: Channel;
    private x = 1;
    constructor(
        private rabbitmqChannelProvider: RabbitmqChannelProvider
    ){

    }
    async publishOrder(request) {
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
          const channel = await this.rabbitmqChannelProvider.createChannel();
          channel.publish(
            `exchange${num}`,
            `exchange${num}.billing${num}`,
            Buffer.from(JSON.stringify(request)),
          );
    }

    async publishPayment(request) {
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
          console.log(request)
          console.log(this.x)
          const num = balancing()
          const channel = await this.rabbitmqChannelProvider.createChannel();
          channel.publish(
            `exchange${num}`,
            `exchange${num}.payment${num}`,
            Buffer.from(JSON.stringify(request)),
          );
    }


}