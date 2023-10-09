import * as path from 'path';
import { Logger } from '@nestjs/common';
import * as glob from 'glob';
import { AbstractType } from '../abstract-type';

// glob(typesPath + '/**/*.ts', (err, files) => {
//   files.map((file) => {
//     console.log(file);
//     import(file.replace(typesPath, '.').replace('.d.ts', '')).then((module) => {
//       console.log(module);
//     });
//   });
// });

export default {
  getTypes: async (): Promise<AbstractType[]> => {
    Logger.log('Loading backup types', 'MyBackups');
    const typesPath = path.join(__dirname, 'implementations');
    const files = glob(typesPath + '/**/*.ts', { sync: true });
    const importedFiles = await Promise.all(
      files.map((file) => {
        return import(file.replace(__dirname, '.').replace('.d.ts', ''));
      }),
    );
    const types = importedFiles.map((file) => {
      for (const key in file) {
        if (file[key].prototype instanceof AbstractType) {
          Logger.log(`Loading backup type ${key}`, 'MyBackups');
          return file[key];
        }
      }
      return null;
    });

    return types.filter((type) => type !== null).map((type) => new type());
  },
};
