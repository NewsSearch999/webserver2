import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class NumberPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value = Number(value)

    if (isNaN(value)) {
      throw new Error('페이지 혹은 가격 에는 숫자만 입력해주세요.');
    }

    return value;
  }
}
