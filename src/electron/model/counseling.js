import { DataTypes } from "sequelize";
import db from "../config/db.js";

export default db.define(
  "counselings",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Generates UUID automatically
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    problem: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    problemSolving: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    counsuler: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "accounts",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);
