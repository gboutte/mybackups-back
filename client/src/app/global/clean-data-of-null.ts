/* eslint-disable @typescript-eslint/no-explicit-any */
export function cleanDataOfNull(data: any): any {
  Object.keys(data).forEach((key: string) => {
    if (data[key] == null) {
      delete data[key];
    }
    if (typeof data[key] === 'object') {
      data[key] = cleanDataOfNull(data[key]);
    }
  });
  return data;
}
