const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // Auth
  getAccountNames: () =>
    ipcRenderer.invoke("get-all-names").then((accounts) => {
      return accounts;
    }),
  login: (param) => ipcRenderer.invoke("login", param),
  register: (param) => ipcRenderer.invoke("register", param),
  changePassword: (param) => ipcRenderer.invoke("change-password", param),
  getAllAccounts: (param) => ipcRenderer.invoke("get-all-accounts", param),
  getAccountById: (param) =>
    ipcRenderer.invoke("get-one-account-by-id", param).then((account) => {
      return account;
    }),

  // Student
  addStudent: (param) => ipcRenderer.invoke("add-student", param),
  getStudentById: (param) =>
    ipcRenderer.invoke("get-one-student-by-id", param).then((student) => {
      return student;
    }),
  getAllStudent: (param) =>
    ipcRenderer.invoke("get-all-student", param).then((student) => {
      return student;
    }),
  getAllStudentName: () =>
    ipcRenderer.invoke("get-all-student-name").then((student) => {
      return student;
    }),
  getStudentCounsul: (param) =>
    ipcRenderer.invoke("get-student-counsul", param).then((student) => {
      return student;
    }),

  // Counseling
  addCounseling: (param) => ipcRenderer.invoke("add-counseling", param),
  getCounselingById: (param) =>
    ipcRenderer.invoke("get-one-counseling-by-id", param).then((counseling) => {
      return counseling;
    }),
  getAllCounseling: (param) =>
    ipcRenderer.invoke("get-all-counseling", param).then((counseling) => {
      return counseling;
    }),

  // Filter
  filterClass: () =>
    ipcRenderer.invoke("filter-class").then((className) => {
      return className;
    }),
  filterStudentName: () =>
    ipcRenderer.invoke("filter-student-name").then((student) => {
      return student;
    }),
  filterCounsulerName: () =>
    ipcRenderer.invoke("filter-counsuler-name").then((counsuler) => {
      return counsuler;
    }),
  filterCounselingType: () =>
    ipcRenderer.invoke("filter-counseling-type").then((type) => {
      return type;
    }),
});
