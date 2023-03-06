import * as amqplib from 'amqplib';

export function ReplyErrorCallback(
  channel: amqplib.Channel,
  msg: amqplib.ConsumeMessage,
  error: any,
) {
  const { replyTo, correlationId } = msg.properties;
  if (replyTo) {
    if (error instanceof Error) {
      error = error.message;
    } else if (typeof error !== 'string') {
      error = JSON.stringify(error);
    }
    //RabbitMQ에서 전송되는 메시지는 일반적으로 Buffer 형태로 전송됩니다. 
    //또한, Buffer 객체는 이진 데이터를 다루기에 적합하고, 
    //RabbitMQ에서 제공하는 channel.publish() 메서드에서도 Buffer 객체를 인자로 받습니다.
    //따라서, 에러 메시지를 Buffer 객체로 만들어서 RabbitMQ 메시지로 전송하는 것이 일반적인 방법입니다.
    error = Buffer.from(JSON.stringify({ status: 'error', message: error }));

    channel.publish('', replyTo, error, { correlationId });
    channel.ack(msg);
  }
}