import {custom} from 'serializr';

export const anyType = custom(
  function (sourcePropertyValue) {
    return sourcePropertyValue;
  },
  function (value) {
    return value
  },
);
