import { ipcMain } from "electron";
import { Op, QueryTypes } from "sequelize";
import { verifyToken } from "./account.js";
import Student from "../model/student.js";
import db from "../config/db.js";

export const studentHandler = () => {
  // Add student
  ipcMain.handle("add-student", async (e, param) => {
    const authenticated = await verifyToken(e, param.token);

    if (!authenticated) {
      throw new Error("Unauthorized");
    }

    const exist = await Student.findOne({
      where: {
        [Op.or]: [{ nisn: param.NISN }, { nis: param.NIS }],
      },
    });

    if (exist) {
      throw new Error("Duplicate student");
    }

    const newStudent = await Student.create({
      nisn: param.NISN,
      nis: param.NIS,
      fullName: param.fullName,
      class: param.className,
      dateOfBirth: param.dateOfBirth,
      placeOfBirth: param.placeOfBirth,
      gender: param.gender,
      address: param.address,
      phone: param.phone,
      parent: param.parent,
    });

    return {
      success: true,
      data: newStudent,
    };
  });

  // Get one by id
  ipcMain.handle("get-one-student-by-id", async (e, param) => {
    const authenticated = await verifyToken(e, param.token);

    if (!authenticated) {
      throw new Error("Unauthorized");
    }

    const student = await Student.findByPk(param.id, {
      raw: true,
      nest: true,
    });

    if (!student) {
      throw new Error(`Student with id ${param.id} not found`);
    }

    return { success: true, data: student };
  });

  // Get all student
  ipcMain.handle("get-all-student", async (e, param) => {
    const {
      token,
      search,
      className,
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
            s.id,
            s.nisn,
            s.nis,
            s.full_name,
            s.class,
            s.created_at,
            s.updated_at
        FROM students s
    `;

    if (search) {
      whereClause = ` WHERE LOWER(CAST(s.nisn AS TEXT)) LIKE '%${search.toLowerCase()}%' OR LOWER(CAST(s.nis AS TEXT)) LIKE '%${search.toLowerCase()}%' OR LOWER(s.full_name) LIKE '%${search.toLowerCase()}%' OR LOWER(s.class) LIKE '%${search.toLowerCase()}%'`;
    }

    if (className) {
      whereClause
        ? (whereClause += ` AND LOWER(s.class) = '${className.toLowerCase()}'`)
        : (whereClause = ` WHERE LOWER(s.class) = '${className.toLowerCase()}'`);
    }

    const sortColumnMap = {
      nisn: "s.nisn",
      nis: "s.nis",
      name: "s.full_name",
      class: "s.class",
      created: "s.created_at",
      modified: "s.updated_at",
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
        FROM students s
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

  // Get student counsul
  ipcMain.handle("get-student-counsul", async (e, param) => {
    const {
      token,
      search,
      className,
      student,
      type,
      sortBy = "nis",
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

    const baseQuery = `
        SELECT
            s.nisn,
            s.nis,
            s.full_name,
            s.class,
            COALESCE(
                JSON_GROUP_ARRAY(
                    JSON_OBJECT(
                        'id', c.id,
                        'type', c.type,
                        'problem', c.problem,
                        'problem_solving', c.problem_solving,
                        'counsuler', a.name
                    )
                ), '[]'
            ) AS counselings
        FROM students s
        LEFT JOIN student_has_counselings shc ON shc.student = s.id
        LEFT JOIN counselings c ON c.id = shc.counseling
        LEFT JOIN accounts a ON a.id = c.counsuler
    `;

    if (search) {
      whereClause = `
      WHERE LOWER(CAST(s.nisn AS TEXT)) LIKE '%${search.toLowerCase()}%'
      OR LOWER(CAST(s.nis AS TEXT)) LIKE '%${search.toLowerCase()}%'
      OR LOWER(s.full_name) LIKE '%${search.toLowerCase()}%'
      OR LOWER(s.class) LIKE '%${search.toLowerCase()}%'
      OR LOWER(c.problem) LIKE '%${search.toLowerCase()}%'`;
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

    if (type) {
      whereClause
        ? (whereClause += ` AND LOWER(c.type) = '${className.toLowerCase()}'`)
        : (whereClause = ` WHERE LOWER(c.type) = '${className.toLowerCase()}'`);
    }

    const sortColumnMap = {
      nisn: "s.nisn",
      nis: "s.nis",
      name: "s.full_name",
      class: "s.class",
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
        FROM students s
            LEFT JOIN student_has_counselings shc ON shc.student = s.id
            LEFT JOIN counselings c ON c.id = shc.counseling
            LEFT JOIN accounts a ON a.id = c.counsuler
        ${whereClause}
        GROUP BY s.id;
    `;

    const totalCountResult = await db.query(totalCountQuery, {
      type: QueryTypes.SELECT,
    });

    const result = await db.query(
      `${baseQuery} ${whereClause} GROUP BY s.id ${sort} ${pagination}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    console.log(
      `${baseQuery} ${whereClause} GROUP BY s.id ${sort} ${pagination}`,
      "<<< Query"
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

  // Get all student name
  ipcMain.handle("get-all-student-names", async (e) => {
    const accounts = await Student.findAll({
      attributes: ["id", "name", "class", "createdAt", "updatedAt"],
      raw: true,
      nest: true,
    });

    return {
      success: true,
      data: accounts,
    };
  });
};
