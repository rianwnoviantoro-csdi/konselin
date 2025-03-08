import { ipcMain } from "electron";
import { QueryTypes } from "sequelize";
import { verifyToken } from "./account.js";
import Counseling from "../model/counseling.js";
import StudentHasCounseling from "../model/student_has_counseling.js";
import db from "../config/db.js";

export const counselingHandler = () => {
  // Add counseling
  ipcMain.handle("add-counseling", async (e, param) => {
    const authenticated = await verifyToken(e, param.token);

    if (!authenticated) {
      throw new Error("Unauthorized");
    }

    const newCounseling = await Counseling.create(
      {
        type: param.type,
        problem: param.problem,
        problemSolving: param.problemSolving,
        counsuler: authenticated.id,
      },
      { returning: true }
    );

    await StudentHasCounseling.create({
      student: param.student,
      counseling: newCounseling.id,
    });

    return {
      success: true,
      data: newCounseling,
    };
  });

  // Get one by id
  ipcMain.handle("get-one-counseling-by-id", async (e, param) => {
    const { token, id } = param;

    const authenticated = await verifyToken(e, token);

    if (!authenticated) {
      throw new Error("Unauthorized");
    }

    const query = `
        SELECT
            c.id,
            c.type,
            c.problem,
            c.problem_solving,
            COALESCE(
                JSON_GROUP_ARRAY(
                    JSON_OBJECT(
                        'full_name', s.full_name,
                        'class', s.class
                    )
                ), '[]'
            ) AS students,
            a.name AS counsuler,
            c.created_at,
            c.updated_at
        FROM counselings c
            LEFT JOIN student_has_counselings shc ON shc.counseling = c.id
            LEFT JOIN students s ON s.id = shc.student
            LEFT JOIN accounts a ON a.id = c.counsuler
        WHERE c.id = :id
        GROUP BY c.id, a.id -- Required for aggregation
    `;

    const result = await db.query(query, {
      replacements: { id: id },
      type: QueryTypes.SELECT,
    });

    if (!result.length) {
      throw new Error(`Counseling with id ${id} not found`);
    }

    return { success: true, data: result };
  });

  // Get all counseling
  ipcMain.handle("get-all-counseling", async (e, param) => {
    const {
      token,
      search,
      className,
      student,
      type,
      counsuler,
      sortBy = "created",
      sortDirection = "DESC",
      page = 1,
      perPage = 15,
    } = param;

    const authenticated = await verifyToken(e, token);

    if (!authenticated) {
      throw new Error("Unauthorized");
    }

    let whereClause = "";
    let sort = "";
    let pagination = "";

    let baseQuery = `
        SELECT
            c.id,
            c.type,
            s.full_name AS student,
            s.class,
            c.problem,
            c.problem_solving,
            a.name AS counsuler,
            c.created_at,
            c.updated_at
        FROM counselings c
            LEFT JOIN accounts a ON a.id = c.counsuler
            LEFT JOIN student_has_counselings shc ON shc.counseling = c.id
            LEFT JOIN students s ON shc.student = s.id
    `;

    if (search) {
      whereClause = `
        WHERE LOWER(c.type) like '%${search.toLowerCase()}%'
            OR LOWER(c.problem) like '%${search.toLowerCase()}%'
            OR LOWER(c.problem_solving) like '%${search.toLowerCase()}%'
            OR LOWER(a.name) like '%${search.toLowerCase()}%'
            OR LOWER(s.full_name) LIKE '%${search.toLowerCase()}%'
            OR LOWER(s.class) LIKE '%${search.toLowerCase()}%'
      `;
    }

    if (type) {
      whereClause
        ? (whereClause += ` AND LOWER(c.type) = '${type.toLowerCase()}'`)
        : (whereClause = ` WHERE LOWER(c.type) = '${type.toLowerCase()}'`);
    }

    if (counsuler) {
      whereClause
        ? (whereClause += ` AND LOWER(a.name) = '${counsuler.toLowerCase()}'`)
        : (whereClause = ` WHERE LOWER(a.name) = '${counsuler.toLowerCase()}'`);
    }

    if (className) {
      whereClause
        ? (whereClause += ` AND LOWER(s.class) = '${className.toLowerCase()}'`)
        : (whereClause = ` WHERE LOWER(s.class) = '${className.toLowerCase()}'`);
    }

    if (student) {
      whereClause
        ? (whereClause += ` AND LOWER(s.full_name) = '${className.toLowerCase()}'`)
        : (whereClause = ` WHERE LOWER(s.full_name) = '${className.toLowerCase()}'`);
    }

    const sortColumnMap = {
      type: "c.type",
      student: "s.full_name",
      className: "s.class",
      problem: "c.problem",
      problem_solving: "c.problem_solving",
      counsuler: "a.name",
      created: "c.created_at",
      modified: "c.updated_at",
    };

    if (!sortColumnMap[sortBy]) {
      throw new Error("Invalid sort parameter");
    }

    sort = ` ORDER BY ${sortColumnMap[sortBy]} ${sortDirection}`;

    const offset = (page - 1) * perPage;

    pagination += ` LIMIT ${perPage} OFFSET ${offset}`;

    const totalCountQuery = `
        SELECT
            COUNT(*) as total
        FROM counselings c
            LEFT JOIN accounts a ON a.id = c.counsuler
        ${whereClause}
    `;

    const totalCountResult = await db.query(totalCountQuery, {
      type: QueryTypes.SELECT,
    });

    const result = await db.query(
      `${baseQuery} ${whereClause} ${sort} ${pagination}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const totalRecords = totalCountResult[0].total;

    const totalPages = Math.ceil(totalRecords / perPage);

    return {
      success: true,
      data: result,
      meta: {
        page: parseInt(page, 10),
        per_page: parseInt(perPage, 10),
        total: totalRecords,
        total_pages: totalPages,
      },
    };
  });
};
