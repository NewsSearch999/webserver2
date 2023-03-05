import { Injectable } from '@nestjs/common';
import { ConnectionService } from './connection/connection.service';
import { createRandomProduct, createRandomUser } from './util/faker';

@Injectable()
export class DummyService {
  constructor(private connectionService: ConnectionService) {}

  async createThousandUsers(){
    const createQuery = `INSERT INTO users (email, password, accountType, deletedType) values (?)`;
    for (let i = 0; i <= 1000; i++) {
      let user = createRandomUser()
      await this.connectionService.Query(createQuery, [
        [
          user.email,
          user.password,
          user.accountType,
          user.deletedType,
        ],
      ]);
    }
  }

  async createHundredThousands() {
    const createQuery = `INSERT INTO products (productName, description, image, price, stock, userId, isDeleted) values (?)`;

    for (let i = 0; i <= 100000; i++) {
      let product = createRandomProduct();

      await this.connectionService.Query(createQuery, [
        [
          product.productName,
          product.description,
          product.image,
          product.price,
          product.stock,
          product.userId,
          false
        ],
      ]);
    }
  }

  async createTwoMillion() {
    await this.createHundredThousands();
    await this.sleep(2);
    console.log('10만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('20만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('30만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('40만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('50만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('60만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('70만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('80만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('90만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('100만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('10만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('20만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('30만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('40만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('50만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('60만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('70만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('80만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('90만');

    await this.createHundredThousands();
    await this.sleep(2);
    console.log('100만');
  }

  sleep(sec: number) {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
  }
}
