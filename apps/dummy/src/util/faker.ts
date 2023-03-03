import { User } from '../user.entity';
import { faker } from '@faker-js/faker';
import { Product } from '../product.entity';

export function createRandomProduct(): Product {
//   faker.locale = 'ko';

  return {
    productName: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    userId: faker.datatype.number({ max : 100}),
    image: faker.image.imageUrl(),
    price: Math.floor(Math.random() * 10000) + 10,
    stock: Math.floor(Math.random() * 1000),
  };
}

// export function createRandomUser(): User {
//   return {
//     email: faker.
//   }
// }
