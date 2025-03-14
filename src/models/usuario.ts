import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/database';

interface UsuarioAttributes {
  id_usuario: number;
  nombre: string;
  email: string;
  contrasena: string;
  id_tipo: string;
  intentos: number;
}

class UsuarioModel extends Model<UsuarioAttributes> implements UsuarioAttributes {
  public id_usuario!: number;
  public nombre!: string;
  public email!: string;
  public contrasena!: string;
  public id_tipo!: string;
  public intentos!: number;
}

UsuarioModel.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contrasena: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id_tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    intentos: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  },
  {
    sequelize,
    modelName: "Usuarios",
    tableName: "USUARIO",
    timestamps: false,
  }
);

export default UsuarioModel;
