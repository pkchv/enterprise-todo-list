import { ClassConstructor, plainToClass } from 'class-transformer';

export function transform<T>(data: object, schema: ClassConstructor<T>): T {
  return plainToClass(schema, data);
}
