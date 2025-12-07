import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import { ReadStream } from 'fs';
import * as moment from 'moment';
import * as path from 'path';
import { fileExistsSync } from 'tsconfig-paths/lib/filesystem';
import { BackupSaveDestination } from '../../../entities/backup-save-destination.entity';
import { AbstractType } from '../../abstract-type';
import { BackupParameterTypeEnum } from '../../enums/backup-parameter-type.enum';
import { BackupDestinationResultInterface } from '../../interfaces/backup-destination-result.interface';
import { BackupDestinationInterface } from '../../interfaces/backup-destination.interface';
import { BackupParameterErrorInterface } from '../../interfaces/backup-parameter-error.interface';
import { BackupParameterInterface } from '../../interfaces/backup-parameter.interface';
import { BackupSourceResultInterface } from '../../interfaces/backup-source-result.interface';
import { BackupSourceInterface } from '../../interfaces/backup-source.interface';
import { BackupTypeConfigInterface } from '../../interfaces/backup-type-config.interface';
import { BackupTypeI18nInterface } from '../../interfaces/backup-type-i18n.interface';
import { BackupTypeLangType } from '../../interfaces/backup-type-lang.type';

export class LocalType
  extends AbstractType
  implements BackupSourceInterface, BackupDestinationInterface
{
  public validateDestinationParameters():
    | true
    | BackupParameterErrorInterface[] {
    const errors: BackupParameterErrorInterface[] = [];
    const dirPath: string = this.createAbsolutePath(
      this.getParameter<string>('path'),
    );

    const writableCheck: true | string = this.checkDirectoryWritable(dirPath);
    if (writableCheck !== true) {
      errors.push({
        parameter: 'path',
        message: writableCheck,
      });
    }

    return errors.length > 0 ? errors : true;
  }

  /**
   * Checks if a directory is writable or can be created.
   * If the directory doesn't exist, it checks the first existing ancestor directory.
   * @param dirPath - The directory path to check
   * @returns true if writable/creatable, or an error message string
   */
  private checkDirectoryWritable(dirPath: string): true | string {
    try {
      // Check if the path exists
      if (fs.existsSync(dirPath)) {
        // Path exists, check if it's a directory
        const stats: fs.Stats = fs.statSync(dirPath);
        if (!stats.isDirectory()) {
          return `The path "${dirPath}" exists but is not a directory.`;
        }
        // Check if it's writable
        fs.accessSync(dirPath, fs.constants.W_OK);
        return true;
      } else {
        // Path doesn't exist, find the first existing ancestor directory
        let currentPath: string = dirPath;
        let parentPath: string = path.dirname(currentPath);

        // Keep going up until we find an existing directory or reach the root
        while (!fs.existsSync(parentPath) && parentPath !== currentPath) {
          currentPath = parentPath;
          parentPath = path.dirname(currentPath);
        }

        // Check if we found an existing ancestor
        if (fs.existsSync(parentPath)) {
          // Check if the existing ancestor is a directory
          const stats: fs.Stats = fs.statSync(parentPath);
          if (!stats.isDirectory()) {
            return `The ancestor path "${parentPath}" exists but is not a directory.`;
          }
          // Check if the existing ancestor is writable
          fs.accessSync(parentPath, fs.constants.W_OK);
          return true;
        } else {
          return `No existing ancestor directory found for "${dirPath}".`;
        }
      }
    } catch (err) {
      Logger.error(err);
      return `The path "${dirPath}" isn't writable or cannot be created.`;
    }
  }
  private makeid(length: number): string {
    let result: string = '';
    const characters: string =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength: number = characters.length;
    let counter: number = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  public async doDestination(
    absolutePathToTemporaryBackup: string,
  ): Promise<BackupDestinationResultInterface> {
    const backupConfigName: string = this.getSlugConfigName();
    return new Promise(
      (
        resolve: (value: BackupDestinationResultInterface) => void,
        reject: (reason?: Error) => void,
      ) => {
        const newName: string =
          backupConfigName +
          '-' +
          moment().format('DDMMYYYYHHmmss') +
          '-' +
          this.makeid(10) +
          path.extname(absolutePathToTemporaryBackup);

        const destinationPath: string = this.createAbsolutePath(
          this.getParameter<string>('path'),
        );

        // Create directory if it doesn't exist
        if (!fs.existsSync(destinationPath)) {
          fs.mkdirSync(destinationPath, { recursive: true });
        }

        fs.copyFile(
          absolutePathToTemporaryBackup,
          path.join(destinationPath, newName),
          (err: NodeJS.ErrnoException | null) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                data: {
                  absolutePath: path.join(destinationPath, newName),
                },
              });
            }
          },
        );
      },
    );
  }

  public getDestinationParameters(): BackupParameterInterface[] {
    return [
      {
        code: 'path',
        type: BackupParameterTypeEnum.STRING,
        required: true,
      },
    ];
  }

  public getConfig(): BackupTypeConfigInterface {
    return {
      code: 'local',
    };
  }

  public getI18n(lang: BackupTypeLangType): BackupTypeI18nInterface {
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

  public validateSourceParameters(): true | BackupParameterErrorInterface[] {
    const errors: BackupParameterErrorInterface[] = [];
    const pathStr: string = this.createAbsolutePath(
      this.getParameter<string>('path'),
    );
    try {
      fs.accessSync(pathStr, fs.constants.R_OK);
    } catch {
      errors.push({
        parameter: 'path',
        message: `The path "${pathStr}" isn't readable.`,
      });
    }

    return errors.length > 0 ? errors : true;
  }

  public doSource(): Promise<BackupSourceResultInterface> {
    const backupConfigName: string = this.getSlugConfigName();
    const tmpDir: string = this.getTemporaryDirectory();
    const absolutePath: string = this.createAbsolutePath(
      this.getParameter<string>('path'),
    );

    return new Promise(
      (
        resolve: (value: BackupSourceResultInterface) => void,
        reject: (reason?: Error) => void,
      ) => {
        const newName: string =
          backupConfigName +
          '-' +
          moment().format('DDMMYYYYHHmmss') +
          '-' +
          this.makeid(10) +
          path.extname(absolutePath);
        const isDirectory: boolean = fs.statSync(absolutePath).isDirectory();

        const newAbsolutePath: string = path.join(tmpDir, newName);

        if (isDirectory) {
          fs.cp(
            absolutePath,
            newAbsolutePath,
            { recursive: true },
            (err: NodeJS.ErrnoException | null) => {
              if (err) {
                Logger.debug('error copy');
                reject(err);
              } else {
                resolve({
                  temporaryFile: newName,
                  absolutePath: newAbsolutePath,
                });
              }
            },
          );
        } else {
          fs.copyFile(
            absolutePath,
            newAbsolutePath,
            (err: NodeJS.ErrnoException | null) => {
              if (err) {
                reject(err);
              } else {
                resolve({
                  temporaryFile: newName,
                  absolutePath: newAbsolutePath,
                });
              }
            },
          );
        }
      },
    );
  }

  public getSourceParameters(): BackupParameterInterface[] {
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

  public getBackup(backupSave: BackupSaveDestination): Promise<ReadStream> {
    return new Promise((resolve: (value: ReadStream) => void) => {
      const absolutePath: string = backupSave.parameters[
        'absolutePath'
      ] as string;
      const readStream: ReadStream = fs.createReadStream(absolutePath);

      resolve(readStream);
    });
  }

  public deleteBackup(backupSave: BackupSaveDestination): Promise<boolean> {
    return new Promise((resolve: (value: boolean) => void) => {
      const absolutePath: string = backupSave.parameters[
        'absolutePath'
      ] as string;
      if (fileExistsSync(absolutePath)) {
        fs.unlink(absolutePath, (err: NodeJS.ErrnoException | null) => {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(false);
      }
    });
  }
}
