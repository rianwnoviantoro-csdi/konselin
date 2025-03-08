import "dotenv/config";
import path from "path";
import { app } from "electron";

export const config = {
  APP: {
    NODE_ENV: process.env.NODE_ENV || "production",
    DEV: process.env.NODE_ENV === "development",
    MACOS: process.platform === "darwin",
    WINDOWS: process.platform === "win32",
    LINUX: process.platform === "linux",
  },
  PATH: {
    DB: {
      DEV: path.join(app.getPath("documents"), "konselin-dev.sqlite"),
      PROD: path.join(app.getPath("documents"), "konselin-prod.sqlite"),
    },
    UI: {
      DEV: "http://localhost:5123",
      PROD: path.join(app.getAppPath(), "dist-react", "index.html"),
    },
    PRELOAD: path.join(app.getAppPath(), "dist-electron", "preload.js"),
  },
  AUTH: {
    SECRET_KEY: process.env.SECRET_KEY,
  },
};
