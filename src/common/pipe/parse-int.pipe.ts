import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    if (value === '' || value === undefined || isNaN(Number(value))) {
      return;
    }

    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(
        'Querystring [' + metadata.data + '] must be number',
      );
    }
    return val;
  }
}
