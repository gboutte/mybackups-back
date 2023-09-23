import { AbstractType } from '../abstract-type';
import { BackupTypeConfigInterface } from '../interfaces/backup-type-config.interface';
import { BackupSourceInterface } from '../interfaces/backup-source.interface';
import { BackupParameterInterface } from '../interfaces/backup-parameter.interface';
import { BackupParameterTypeEnum } from '../enums/backup-parameter-type.enum';
import * as fs from 'fs';
import { BackupParameterErrorInterface } from '../interfaces/backup-parameter-error.interface';
import { BackupDestinationInterface } from '../interfaces/backup-destination.interface';
import * as moment from 'moment';
import * as path from 'path';
import { BackupSourceResultInterface } from '../interfaces/backup-source-result.interface';
import { BackupDestinationResultInterface } from '../interfaces/backup-destination-result.interface';

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
        name: 'path',
        description: 'The path to folder to save the backup',
        type: BackupParameterTypeEnum.STRING,
        required: true,
      },
    ];
  }

  getConfig(): BackupTypeConfigInterface {
    return {
      name: 'Local',
      code: 'local',
      description: 'Local backup',
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
        name: 'path',
        description: 'The path to backup',
        type: BackupParameterTypeEnum.STRING,
        required: true,
      },
    ];
  }

  private createAbsolutePath(relativePath: string): string {
    const rootPath = 'C:\\Users\\Gregory\\Documents\\backups test';
    return path.join(rootPath, relativePath);
  }
}
