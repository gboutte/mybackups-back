import * as os from 'os';
import slugify from 'slugify';
import { instanceOfBackupDestination } from './interfaces/backup-destination.interface';
import { BackupParameterInterface } from './interfaces/backup-parameter.interface';
import { instanceOfBackupSource } from './interfaces/backup-source.interface';
import { BackupTypeConfigInterface } from './interfaces/backup-type-config.interface';
import { BackupTypeI18nInterface } from './interfaces/backup-type-i18n.interface';
import { BackupTypeLangType } from './interfaces/backup-type-lang.type';

export type ParametersType = Record<string, unknown>;

export type SourceSchema = {
  isSource: boolean;
  parameters: BackupParameterInterface[];
};

export type DestinationSchema = {
  isDestination: boolean;
  parameters: BackupParameterInterface[];
};

export type AbstractTypeSchema = {
  config: BackupTypeConfigInterface;
  source: SourceSchema;
  destination: DestinationSchema;
};

export abstract class AbstractType {
  protected parameters: ParametersType;
  private configName: string;

  constructor() {}

  /**
   * Return the config of the backup type
   * This define the name, code and description of the backup type
   * @returns {BackupTypeConfigInterface}
   */
  public abstract getConfig(): BackupTypeConfigInterface;

  /**
   * Return the internalizations parameters for this type
   * This is used to return the information to the front-end by the controller
   */
  public abstract getI18n(lang: BackupTypeLangType): BackupTypeI18nInterface;

  /**
   * This method define the user input to configure the backup type
   * (source and destination)
   * @param parameters
   */
  public setParameters(parameters: ParametersType): void {
    this.parameters = parameters;
  }

  /**
   * This method return the backup type definition in json schema
   * This is used to return the information to the front-end by the controller
   */
  public getJsonSchema(): AbstractTypeSchema {
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
  protected getParameters(): ParametersType {
    return this.parameters;
  }

  /**
   * This method return the value of a parameter that the user defined.
   * This method can be called by the child class to get the parameters while running the backup source or destination
   * @param key
   * @protected
   */
  protected getParameter<T>(key: string): T {
    return this.parameters[key] as T;
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

  private getSourceJsonSchema(): SourceSchema {
    if (instanceOfBackupSource(this)) {
      return {
        isSource: true,
        parameters: this.getSourceParameters(),
      };
    } else {
      return {
        isSource: false,
        parameters: [],
      };
    }
  }

  private getDestinationJsonSchema(): DestinationSchema {
    if (instanceOfBackupDestination(this)) {
      return {
        isDestination: true,
        parameters: this.getDestinationParameters(),
      };
    } else {
      return {
        isDestination: false,
        parameters: [],
      };
    }
  }

  /**
   * This method return the name of the config that is beeing run
   */
  public getConfigName(): string {
    return this.configName;
  }
  public getSlugConfigName(): string {
    return slugify(this.configName, {
      lower: true,
      strict: true,
      replacement: '-',
      trim: true,
    });
  }

  /**
   * This method set the name of the config that is beeing run
   * @param configName
   */
  public setConfigName(configName: string): void {
    this.configName = configName;
  }
}
