import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/database';
import UsuarioModel from "./usuario";

interface ClaseAttributes {
  id_clase: number;
  nombre_clase: string;
  horario: string;
  duracion: number;
  id_profesor: number;
}

class ClaseModel extends Model<ClaseAttributes> implements ClaseAttributes {
  public id_clase!: number;
  public nombre_clase!: string;
  public horario!: string;
  public duracion!: number;
  public id_profesor!: number;
}

ClaseModel.init(
  {
    id_clase: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_clase: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    horario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_profesor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UsuarioModel,
        key: "id_usuario",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Clase",
    tableName: "CLASE",
    timestamps: false,
  }
);

export default ClaseModel;