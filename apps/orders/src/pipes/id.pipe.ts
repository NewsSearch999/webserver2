import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class IdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    let id = Number(value)

    if (isNaN(id)) {
      throw new Error('id를 똑바로 입력하세요.');
    }

    if (!id) {
      return (id = 1);
    }

    return id;
  }
}
