import { SetMetadata } from '@nestjs/common';

export const IS_INSTALL_KEY: string = 'isInstall';

export const Install = (): ReturnType<typeof SetMetadata> =>
  SetMetadata(IS_INSTALL_KEY, true);
