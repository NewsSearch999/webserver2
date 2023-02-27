import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class NumberPipe implements PipeTransform {

    transform(value: any, metadata: ArgumentMetadata){
        value = Number(value)

        if(!value){
            throw new Error('페이지 혹은 가격 값이 잘못 들어왔어요.')
        }

        return value;
    }
}