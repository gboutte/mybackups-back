import { custom, PropSchema } from 'serializr';

export const date: PropSchema = custom(
  function (sourcePropertyValue: Date | null): string | null {
    if (sourcePropertyValue) {
      //Build a date string in format YYYY-MM-DD
      const year: number = sourcePropertyValue.getFullYear();
      const month: string = (sourcePropertyValue.getMonth() + 1)
        .toString()
        .padStart(2, '0');
      const day: string = sourcePropertyValue
        .getDate()
        .toString()
        .padStart(2, '0');
      return `${year}-${month}-${day}`;
    } else {
      return null;
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (value: any): Date | null {
    return value === null ? null : new Date(value);
  },
);
