export function toParamify(data: {[key: string]: any}) {
  return Object.keys(data).map(key => `${key}(${data[key]})`).join(' ');
}

export function parseParams(data: string) {
  const result: any = {};
  data.split(')').forEach(value => {
    const value1 = value.split('(');
    if (value1.length < 2) { return; }
    result[value1[0].replace(' ', '')] = value1[1];
  });
  return result;
}
