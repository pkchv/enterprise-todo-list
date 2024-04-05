import { validateSync } from 'class-validator';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Logger } from '@nestjs/common';

export function validate<T>(data: object, schema: ClassConstructor<T>) {
  const dto = plainToClass(schema, data);

  const errors = validateSync(dto as object, {
    skipMissingProperties: false,
    forbidUnknownValues: true,
  });

  Logger.debug(`Validation errors: ${JSON.stringify(errors)}`);

  return errors.length === 0;
}
