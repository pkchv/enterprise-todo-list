import { nanoid } from 'nanoid';

export function createUniqueId(): string {
  return nanoid();
}
