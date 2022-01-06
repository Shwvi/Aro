const { isDev } = require(".");
const logger = (message) => {
  if (isDev) {
    console.log(message);
  }
  return;
};
module.exports = {
  logger,
};
