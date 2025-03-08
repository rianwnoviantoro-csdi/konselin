import jwt from "jsonwebtoken";
import { ipcMain } from "electron";
import bcrypt from "bcrypt";
import { config } from "../config/env.js";
import Account from "../model/account.js";
import db from "../config/db.js";
import { QueryTypes } from "sequelize";

export const verifyToken = async (e, token) => {
  if (!token) throw new Error("Unauthorized");

  const decodedToken = jwt.decode(token, config.AUTH.SECRET_KEY);

  return decodedToken;
};

export const accountHandler = () => {
  // register
  ipcMain.handle("register", async (e, param) => {
    const authenticated = await verifyToken(e, param.token);

    if (!authenticated) {
      throw new Error("Unauthorized");
    }

    const newAccount = await Account.create({
      name: param.name,
      phone: param.phone,
      password: param.password,
    });

    delete newAccount.password;

    return {
      success: true,
      data: newAccount,
    };
  });

  // Login
  ipcMain.handle("login", async (e, param) => {
    let exist = await Account.findOne({
      where: { phone: param.phone },
    });

    if (!exist) {
      throw new Error("Account not found");
    }

    exist = exist.toJSON();

    const isValid = await bcrypt.compare(param.password, exist.password);

    if (!isValid) {
      throw new Error("Invalid credential");
    }

    const token = jwt.sign(
      {
        id: exist.id,
        name: exist.name,
      },
      config.AUTH.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return { success: true, data: { user: exist, token: token } };
  });

  // Get all accounts
  ipcMain.handle("get-all-accounts", async (e, param) => {
    const {
      token,
      search,
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
            s.name,
            s.phone,
            s.created_at,
            s.updated_at
        FROM accounts s
    `;

    if (search) {
      whereClause = ` WHERE LOWER(s.name) like '%${search.toLowerCase()}%' OR LOWER(s.phone) like '%${search.toLowerCase()}%'`;
    }

    const columnMap = {
      name: "s.name",
      phone: "s.phone",
      created: "s.created_at",
      modified: "s.updated_at",
    };

    if (!columnMap[sortBy]) {
      throw new Error("Invalid sort parameter");
    }

    sort = ` ORDER BY ${columnMap[sortBy]} ${sortDirection}`;

    const offset = (page - 1) * perPage;

    pagination += ` LIMIT ${perPage} OFFSET ${offset}`;

    const totalCountQuery = `SELECT COUNT(*) as total FROM accounts s ${whereClause}`;
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

  // Get one by id
  ipcMain.handle("get-one-account-by-id", async (e, param) => {
    const authenticated = await verifyToken(e, param.token);

    if (!authenticated) {
      throw new Error("Unauthorized");
    }

    const account = await Account.findByPk(param.id, {
      raw: true,
      nest: true,
    });

    if (!account) {
      throw new Error(`Account with id ${param.id} not found`);
    }

    delete account.password;

    return { success: true, data: account };
  });

  // Get all name
  ipcMain.handle("get-all-names", async (e) => {
    const accounts = await Account.findAll({
      attributes: ["id", "name", "phone", "createdAt", "updatedAt"],
      raw: true,
      nest: true,
    });

    return {
      success: true,
      data: accounts,
    };
  });
};
