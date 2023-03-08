export default {
    exchanges: [
      {
        name: 'exchange1',
        type: 'direct',
        options: {
          durable: true,
        },
      },
      {
        name: 'exchange2',
        type: 'direct',
        options: {
          durable: true,
        },
      },
    ],
    queues: [
      {
        name: 'billing1',
        options: {
          durable: true,
        },
        bindings: [
          {
            exchange: 'exchange1',
            routingKey: 'exchange1.billing1',
          },
        ],
      },
      {
        name: 'billing2',
        options: {
          durable: true,
        },
        bindings: [
          {
            exchange: 'exchange2',
            routingKey: 'exchange2.billing2',
          },
        ],
      },
      {
        name: 'payment1',
        options: {
          durable: true,
        },
        bindings: [
          {
            exchange: 'exchange1',
            routingKey: 'exchange1.payment1',
          },
        ],
      },
      {
        name: 'payment2',
        options: {
          durable: true,
        },
        bindings: [
          {
            exchange: 'exchange2',
            routingKey: 'exchange2.payment2',
          },
        ],
      },
    ],
  };
  