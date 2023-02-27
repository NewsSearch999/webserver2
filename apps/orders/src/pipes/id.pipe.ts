import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class IdPipe implements PipeTransform {

    transform(value: any, metadata: ArgumentMetadata){
        value = Number(value)

        if(!value){
            return value = 1
        }

        return value;
    }
}