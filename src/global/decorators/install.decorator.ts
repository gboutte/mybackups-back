import { SetMetadata } from '@nestjs/common';

export const IS_INSTALL_KEY = 'isInstall';

export const Install = () => SetMetadata(IS_INSTALL_KEY, true);
