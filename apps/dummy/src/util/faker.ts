import { faker } from '@faker-js/faker';
import { Product } from '../product.entity';

export function createRandomProduct(): Product {
//   faker.locale = 'ko';

  return {
    productName: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    image: faker.image.imageUrl(),
    price: Math.floor(Math.random() * 1000) + 10,
  };
}

