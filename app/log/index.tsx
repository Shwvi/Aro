export function log(message: string, header?: string) {
  if (__DEV__) {
    console.log(`${header || "Logger"}:${message}`);
  }
}
