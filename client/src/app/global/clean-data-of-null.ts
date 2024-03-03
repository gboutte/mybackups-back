export function cleanDataOfNull(data: any) {
  Object.keys(data).forEach((key) => {
    data[key] == null && delete data[key];
    if (typeof data[key] === 'object') {
      data[key] = cleanDataOfNull(data[key]);
    }
  });
  return data;
}
