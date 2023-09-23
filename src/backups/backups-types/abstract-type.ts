import { BackupTypeConfigInterface } from './interfaces/backup-type-config.interface';
import * as os from 'os';

export abstract class AbstractType {
  protected parameters: any;

  constructor() {}

  abstract getConfig(): BackupTypeConfigInterface;

  public setParameters(parameters: any): void {
    this.parameters = parameters;
  }

  protected getParameters(): any {
    return this.parameters;
  }

  protected getParameter(key: string): any {
    return this.parameters[key];
  }

  protected hasParameter(key: string): boolean {
    return this.parameters.hasOwnProperty(key);
  }

  protected getTemporaryDirectory(): string {
    return os.tmpdir();
  }
}
