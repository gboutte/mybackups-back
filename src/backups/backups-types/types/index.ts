import { Logger } from '@nestjs/common';
import * as glob from 'glob';
import * as path from 'path';
import { AbstractType } from '../abstract-type';

export type BackupClass = new () => AbstractType;

class BackupTypesManager {
  private static _loadedTypes: BackupClass[] = [];
  private static _instanciatedTypes: AbstractType[];

  private static _isInstanciated: boolean = false;
  private static _isLoaded: boolean = false;

  public static async loadTypes(): Promise<void> {
    Logger.debug('Loading backup types', 'MyBackups');
    const typesPath: string = path.join(__dirname, 'implementations');
    const files: string[] = glob(typesPath + '/**/*.ts', { sync: true });
    const importedFiles: Record<string, BackupClass>[] = await Promise.all(
      files.map((file: string) => {
        return import(file.replace(__dirname, '.').replace('.d.ts', ''));
      }),
    );
    const types: (BackupClass | null)[] = importedFiles.map(
      (file: Record<string, BackupClass>) => {
        for (const key in file) {
          if (file[key].prototype instanceof AbstractType) {
            Logger.log(`Loading backup type ${key}`, 'MyBackups');
            return file[key];
          }
        }
        return null;
      },
    );

    BackupTypesManager._loadedTypes = types.filter(
      (type: BackupClass | null) => type !== null,
    ) as BackupClass[];
    BackupTypesManager._isLoaded = true;
  }

  public static async instanciateTypes(): Promise<void> {
    Logger.log('Instanciating backup types', 'MyBackups');
    BackupTypesManager._instanciatedTypes = BackupTypesManager._loadedTypes.map(
      (type: BackupClass) => new type(),
    );
    BackupTypesManager._isInstanciated = true;
  }

  public static getTypes(): AbstractType[] {
    if (!BackupTypesManager.isLoaded) {
      throw new Error('Backup types not loaded');
    }

    return BackupTypesManager._instanciatedTypes;
  }

  public static isLoaded(): boolean {
    return BackupTypesManager._isLoaded;
  }

  public static isInstanciated(): boolean {
    return BackupTypesManager._isInstanciated;
  }
}

export default {
  getTypes: async (): Promise<AbstractType[]> => {
    if (!BackupTypesManager.isLoaded()) {
      await BackupTypesManager.loadTypes();
    }
    if (!BackupTypesManager.isInstanciated()) {
      await BackupTypesManager.instanciateTypes();
    }
    return BackupTypesManager.getTypes();
  },
};
