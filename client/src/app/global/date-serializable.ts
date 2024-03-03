import { custom } from 'serializr';

export const date = custom(
  function (sourcePropertyValue) {
    return sourcePropertyValue !== null &&
      sourcePropertyValue !== undefined &&
      typeof sourcePropertyValue.getTime === 'function'
      ? sourcePropertyValue.getTime()
      : null;
  },
  function (value) {
    return new Date(value);
  },
);
