import { DataTypes } from "sequelize";
import db from "./../config/db.js";

export default db.define(
  "student_has_counselings",
  {
    student: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "students",
        key: "id",
      },
    },
    counseling: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "counselings",
        key: "id",
      },
    },
  },
  {
    underscored: true,
  }
);
