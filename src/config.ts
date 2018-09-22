import defaults from './config/defaults';

const PRODUCTION = "production";
const DEVELOPMENT = "development";

export default (env) => {
  let options;

  switch ((env || PRODUCTION).toLowerCase()) {
    case PRODUCTION:
      options = require("./config/production").default;
      break;

    case DEVELOPMENT:
      options = require("./config/development").default;
      break;

    default:
      throw new Error(`Unknown environment "${env}"`);
  }

  return Object.assign(
    {},
    defaults,
    options
  );
};
