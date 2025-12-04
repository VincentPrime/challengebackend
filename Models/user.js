import { DataTypes,Model } from "sequelize";
import sequelize from "../config/db.js";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user","admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    tableName: "users",
    sequelize,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default User;
