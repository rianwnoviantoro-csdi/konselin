import { Sequelize } from "sequelize";
import { config } from "./env.js";

const dbPath = config.APP.DEV ? config.PATH.DB.DEV : config.PATH.DB.PROD;

export default new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false,
});
