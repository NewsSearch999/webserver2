export class ExchangeFunction {
    randomExchange() {
        let array = ['exchange1', 'exchange2']
        let idx = (Math.random()>=0.5)? 1 : 0;
        
      return array[idx]
  }
  }