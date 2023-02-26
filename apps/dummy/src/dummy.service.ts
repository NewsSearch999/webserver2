import { Injectable } from '@nestjs/common';
import { urlToHttpOptions } from 'url';
import { ConnectionService } from './connection/connection.service';
import { createRandomProduct } from './util/faker';

@Injectable()
export class DummyService {
  constructor(private connectionService: ConnectionService) {}

  async createProducts() {
    const createQuery = `INSERT INTO products (productName, description, image, price) values (?)`;

    for (let i = 0; i <= 1000; i++) {
      let product = createRandomProduct();

      await this.connectionService.Query(createQuery, [
        [
          product.productName,
          product.description,
          product.image,
          product.price,
        ],
      ]);
    }
  }
}
