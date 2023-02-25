import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Product } from '../../product.entity';

class ProductSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const productRepository = dataSource.getRepository(Product);
        await productRepository.insert([{
            productName: '테스트',
            description: '테스트를 해보자',
            image: 'http://테스트',
            price: 1000,

        }])

        const productFactory = factoryManager.get(Product);
        await productFactory.saveMany(5);

    }
}


