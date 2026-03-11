import "ts-node/register";
import dbConfig from "./db.config.js";

const environment = "development";
const config = dbConfig[environment];

export default config;
