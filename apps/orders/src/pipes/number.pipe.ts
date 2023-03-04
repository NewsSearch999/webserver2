import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { number } from 'joi';

export class NumberPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const number = +value;

    if (isNaN(number)) {
      throw new Error('페이지 혹은 가격 에는 숫자만 입력해주세요.');
    }

    return number;
  }
}
