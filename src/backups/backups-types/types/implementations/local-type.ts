import { AbstractType } from '../../abstract-type';
import { BackupTypeConfigInterface } from '../../interfaces/backup-type-config.interface';
import { BackupSourceInterface } from '../../interfaces/backup-source.interface';
import { BackupParameterInterface } from '../../interfaces/backup-parameter.interface';
import { BackupParameterTypeEnum } from '../../enums/backup-parameter-type.enum';
import * as fs from 'fs';
import { BackupParameterErrorInterface } from '../../interfaces/backup-parameter-error.interface';
import { BackupDestinationInterface } from '../../interfaces/backup-destination.interface';
import * as moment from 'moment';
import * as path from 'path';
import { BackupSourceResultInterface } from '../../interfaces/backup-source-result.interface';
import { BackupDestinationResultInterface } from '../../interfaces/backup-destination-result.interface';
import { Logger } from '@nestjs/common';
import { BackupTypeI18nInterface } from '../../interfaces/backup-type-i18n.interface';
import { BackupTypeLangType } from '../../interfaces/backup-type-lang.type';

export class LocalType
  extends AbstractType
  implements BackupSourceInterface, BackupDestinationInterface
{
  validateDestinationParameters(): true | BackupParameterErrorInterface[] {
    const errors: BackupParameterErrorInterface[] = [];
    const path = this.createAbsolutePath(this.getParameter('path'));
    try {
      fs.accessSync(path, fs.constants.W_OK);
    } catch (err) {
      errors.push({
        parameter: 'path',
        message: `The path "${path}" isn't writable.`,
      });
    }

    return errors.length > 0 ? errors : true;
  }

  async doDestination(
    pathToTemporaryBackup: string,
  ): Promise<BackupDestinationResultInterface> {
    const backupConfigName = 'test';
    return new Promise((resolve, reject) => {
      const newName =
        backupConfigName +
        '-' +
        moment().format('DDMMYYYYHHmmss') +
        path.extname(pathToTemporaryBackup);

      const destinationPath = this.createAbsolutePath(
        this.getParameter('path'),
      );

      fs.copyFile(
        path.join(this.getTemporaryDirectory(), pathToTemporaryBackup),
        path.join(destinationPath, newName),
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              data: {
                path: destinationPath + newName,
              },
            });
          }
        },
      );
    });
  }

  getDestinationParameters(): BackupParameterInterface[] {
    return [
      {
        code: 'path',
        type: BackupParameterTypeEnum.STRING,
        required: true,
      },
    ];
  }

  getConfig(): BackupTypeConfigInterface {
    return {
      code: 'local',
    };
  }

  getI18n(lang: BackupTypeLangType): BackupTypeI18nInterface {
    if (lang === 'fr') {
      return this.getI18nFr();
    } else {
      return this.getI18nEn();
    }
  }

  private getI18nFr(): BackupTypeI18nInterface {
    return {
      name: 'Local',
      description:
        "Directement sur le système de fichiers local de l'application",
      parameters: {
        destination: {
          path: {
            name: 'Chemin',
            description: `Le chemin du dossier pour enregistrer la sauvegarde, vous pouvez utiliser un chemin absolu ou un chemin relatif à ${path.resolve()}`,
          },
        },
        source: {
          path: {
            name: 'Chemin',
            description: `Le chemin du fichier à sauvegarder, vous pouvez utiliser un chemin absolu ou un chemin relatif à ${path.resolve()}`,
          },
        },
      },
    };
  }

  private getI18nEn(): BackupTypeI18nInterface {
    return {
      name: 'Local',
      description: 'Directly on the local file system of the application',
      parameters: {
        destination: {
          path: {
            name: 'Path',
            description: `The path to folder to save the backup, you can use an absolute path or a relative path to ${path.resolve()}`,
          },
        },
        source: {
          path: {
            name: 'Path',
            description: `The path to backup, you can use an absolute path or a relative path to ${path.resolve()}`,
          },
        },
      },
    };
  }

  validateSourceParameters(): true | BackupParameterErrorInterface[] {
    const errors: BackupParameterErrorInterface[] = [];
    const path = this.createAbsolutePath(this.getParameter('path'));
    try {
      fs.accessSync(path, fs.constants.R_OK);
    } catch (err) {
      errors.push({
        parameter: 'path',
        message: `The path "${path}" isn't readable.`,
      });
    }

    return errors.length > 0 ? errors : true;
  }

  doSource(): Promise<BackupSourceResultInterface> {
    const backupConfigName = 'test';
    const tmpDir = this.getTemporaryDirectory();
    const absolutePath = this.createAbsolutePath(this.getParameter('path'));

    return new Promise((resolve, reject) => {
      const newName =
        backupConfigName +
        '-' +
        moment().format('DDMMYYYYHHmmss') +
        path.extname(absolutePath);

      fs.copyFile(absolutePath, path.join(tmpDir, newName), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            temporaryFile: newName,
          });
        }
      });
    });
  }

  getSourceParameters(): BackupParameterInterface[] {
    return [
      {
        code: 'path',
        type: BackupParameterTypeEnum.STRING,
        required: true,
      },
    ];
  }

  private createAbsolutePath(paramPath: string): string {
    return path.resolve(paramPath);
  }
}
