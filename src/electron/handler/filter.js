import { ipcMain } from "electron";
import { QueryTypes } from "sequelize";
import db from "../config/db.js";

export const filterHandler = () => {
  // List class name
  ipcMain.handle("filter-class", async () => {
    const query = `SELECT DISTINCT s.class FROM students s;`;

    const result = await db.query(query, { type: QueryTypes.SELECT });

    return {
      success: true,
      data: result,
    };
  });

  // List student name
  ipcMain.handle("filter-student-name", async () => {
    const query = `SELECT s.id, s.full_name FROM students s;`;

    const result = await db.query(query, { type: QueryTypes.SELECT });

    return {
      success: true,
      data: result,
    };
  });

  // List counsuler name
  ipcMain.handle("filter-counsuler-name", async () => {
    const query = `
            SELECT
                DISTINCT c.counsuler, a.name, a.phone
            FROM counselings c
            JOIN accounts a ON a.id = c.counsuler;
        `;

    const result = await db.query(query, { type: QueryTypes.SELECT });

    return {
      success: true,
      data: result,
    };
  });

  // List counseling type
  ipcMain.handle("filter-counseling-type", async () => {
    const query = `
            SELECT
                DISTINCT c.type
            FROM counselings c;
        `;

    const result = await db.query(query, { type: QueryTypes.SELECT });

    return {
      success: true,
      data: result,
    };
  });
};
