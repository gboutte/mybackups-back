import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY: string = 'isPublic';

export const Public = (): ReturnType<typeof SetMetadata> =>
  SetMetadata(IS_PUBLIC_KEY, true);
