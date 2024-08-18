export interface BackupTypeI18nInterface {
  name: string;
  description: string;
  parameters: {
    destination: {
      [key: string]: {
        name: string;
        description: string;
      };
    };
    source: {
      [key: string]: {
        name: string;
        description: string;
      };
    };
  };
}
