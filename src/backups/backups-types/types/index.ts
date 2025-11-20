import { Logger } from '@nestjs/common';
import * as glob from 'glob';
import * as path from 'path';
import { AbstractType } from '../abstract-type';


export type BackupClass = new () => AbstractType;

class BackupTypesManager{

  private static _loadedTypes:BackupClass[]=[];
  private static _instanciatedTypes : AbstractType[];

  private static _isInstanciated = false;
  private static _isLoaded = false;


  public static async loadTypes() {
    Logger.debug('Loading backup types', 'MyBackups');
    const typesPath = path.join(__dirname, 'implementations');
    const files = glob(typesPath + '/**/*.ts', {sync: true});
    const importedFiles = await Promise.all(
        files.map((file) => {
          return import(file.replace(__dirname, '.').replace('.d.ts', ''));
        }),
    );
    const types:(BackupClass|null)[] = importedFiles.map((file) => {
      for (const key in file) {
        if (file[key].prototype instanceof AbstractType) {
          Logger.log(`Loading backup type ${key}`, 'MyBackups');
          return file[key];
        }
      }
      return null;
    });

    BackupTypesManager._loadedTypes = types.filter((type) => type !== null);
    BackupTypesManager._isLoaded = true;
  }

  public static async instanciateTypes() {
    Logger.log('Instanciating backup types', 'MyBackups');
    BackupTypesManager._instanciatedTypes = BackupTypesManager._loadedTypes.map((type) => new type());
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

    if(!BackupTypesManager.isLoaded()){
      await BackupTypesManager.loadTypes();
    }
    if(!BackupTypesManager.isInstanciated()){
      await BackupTypesManager.instanciateTypes();
    }
    return BackupTypesManager.getTypes();
  },
};
