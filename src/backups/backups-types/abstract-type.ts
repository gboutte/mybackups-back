import { BackupTypeConfigInterface } from './interfaces/backup-type-config.interface';
import * as os from 'os';
import { instanceOfBackupSource } from './interfaces/backup-source.interface';
import { instanceOfBackupDestination } from './interfaces/backup-destination.interface';

export abstract class AbstractType {
  protected parameters: any;

  constructor() {}

  /**
   * Return the config of the backup type
   * This define the name, code and description of the backup type
   * @returns {BackupTypeConfigInterface}
   */
  abstract getConfig(): BackupTypeConfigInterface;

  /**
   * This method define the user input to configure the backup type
   * (source and destination)
   * @param parameters
   */
  public setParameters(parameters: any): void {
    this.parameters = parameters;
  }

  /**
   * This method return the backup type definition in json schema
   * This is used to return the information to the front-end by the controller
   */
  public getJsonSchema(): any {
    return {
      config: this.getConfig(),
      source: this.getSourceJsonSchema(),
      destination: this.getDestinationJsonSchema(),
    };
  }

  /**
   * This method return all the paramter that the user defined.
   * This method can be called by the child class to get the parameters while running the backup source or destination
   * @protected
   */
  protected getParameters(): any {
    return this.parameters;
  }

  /**
   * This method return the value of a parameter that the user defined.
   * This method can be called by the child class to get the parameters while running the backup source or destination
   * @param key
   * @protected
   */
  protected getParameter(key: string): any {
    return this.parameters[key];
  }

  /**
   * This method return true if the user defined the parameter
   * This method can be called by the child class to get the parameters while running the backup source or destination
   * @param key
   * @protected
   */
  protected hasParameter(key: string): boolean {
    return this.parameters.hasOwnProperty(key);
  }

  /**
   * This method return the path to the temporary directory
   * You must put the temporary backup in this directory while running the backup source
   * Then the backup destination will copy the temporary backup from this directory
   * @returns {string}
   * @protected
   */
  protected getTemporaryDirectory(): string {
    return os.tmpdir();
  }

  private getSourceJsonSchema(): any {
    if (instanceOfBackupSource(this)) {
      return {
        isSource: true,
        parameters: this.getSourceParameters(),
      };
    } else {
      return {
        isSource: false,
      };
    }
  }

  private getDestinationJsonSchema(): any {
    if (instanceOfBackupDestination(this)) {
      return {
        isDestination: true,
        parameters: this.getDestinationParameters(),
      };
    } else {
      return {
        isDestination: false,
      };
    }
  }
}
