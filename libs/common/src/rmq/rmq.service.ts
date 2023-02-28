import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
    constructor(
        private readonly configService: ConfigService
    ){}

    //noAck의 기본값을 false, acknowledge 메시지를 수동으로
    //Ack을 받아야, 즉 consumer에게 메시지가 갔다는 신호가 와야 rabbitmq는 그걸 지우던가 합니다.
    getOptions(queue: string, noAck = false) : RmqOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RABBIT_MQ_URI')],
                queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
                noAck, //Defaults to false. If false, manual acknowledgment mode enabled
                persistent: true,
                //persistent (boolean): If truthy, the message will survive broker restarts provided it’s in a queue that also survives restarts. 
            }
        }
    }

    ack(context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        channel.ack(originalMessage);
      }
}
