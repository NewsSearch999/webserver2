import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class StringPipe implements PipeTransform {

    transform(value: any, metadata: ArgumentMetadata){
        value = value.toString()
        if(!value){
            throw new Error('상품 이름이 잘못 들어왔어요.')
        }

        return value;
    }
}