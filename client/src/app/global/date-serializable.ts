import { custom } from 'serializr';

export const date = custom(
  function (sourcePropertyValue) {
    return sourcePropertyValue.getTime();
  },
  function (value) {
    return new Date(value);
  },
);
