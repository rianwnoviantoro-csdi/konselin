import { app, BrowserWindow } from "electron";
import { config } from "./config/env.js";
import db from "./config/db.js";
import Account from "./model/account.js";
import Student from "./model/student.js";
import Counseling from "./model/counseling.js";
import StudentHasCounseling from "./model/student_has_counseling.js";
import { accountHandler } from "./handler/account.js";
import { studentHandler } from "./handler/student.js";
import { counselingHandler } from "./handler/counseling.js";
import { filterHandler } from "./handler/filter.js";

let window;

function init() {
  if (window) return;

  window = new BrowserWindow({
    width: 1366,
    height: 758,
    // titleBarStyle: config.APP.MACOS ? "hidden" : "default",
    webPreferences: {
      preload: config.PATH.PRELOAD,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  window.on("closed", () => {
    window = null;
  });

  if (config.APP.DEV) {
    window.loadURL(config.PATH.UI.DEV);
  } else {
    window.loadFile(config.PATH.UI.PROD);
  }
}

app.whenReady().then(async () => {
  await db
    .sync()
    .then(() => console.log("Succesfully sync database"))
    .catch((e) => console.error("Failed sync database", e));

  const account = await Account.findOne();
  await Student.findOne();
  await Counseling.findOne();
  await StudentHasCounseling.findOne();

  if (!account) {
    await Account.create({
      name: "Super admin",
      phone: "6280000000000",
      password: "Password1",
    });

    console.log("Starter account initialized");
  }

  accountHandler();
  studentHandler();
  counselingHandler();
  filterHandler();

  init();

  app.on("window-all-closed", () => {
    if (!config.APP.MACOS) {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      init();
    }
  });
});
