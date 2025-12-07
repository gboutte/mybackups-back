/* eslint-disable @typescript-eslint/no-explicit-any */

import { custom, PropSchema } from 'serializr';

export const anyType: PropSchema = custom(
  function (sourcePropertyValue: any) {
    return sourcePropertyValue;
  },
  function (value: any): any {
    return value;
  },
);
