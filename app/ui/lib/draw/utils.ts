export function wheel<T>(arr: T[]) {
  const { length } = arr;
  let index = 0;
  return function next() {
    if (index === length) {
      index = 0;
      return arr[index++];
    } else return arr[index++];
  };
}
