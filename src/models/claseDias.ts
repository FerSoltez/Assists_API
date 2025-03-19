import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import ClaseModel from "./clase";

interface ClaseDiasAttributes {
  id_clase_dia: number;
  id_clase: number;
  dia_semana: string;
}

// Define una interfaz para los atributos opcionales al crear una nueva instancia
interface ClaseDiasCreationAttributes extends Optional<ClaseDiasAttributes, "id_clase_dia"> {}

class ClaseDiasModel extends Model<ClaseDiasAttributes, ClaseDiasCreationAttributes> implements ClaseDiasAttributes {
  public id_clase_dia!: number;
  public id_clase!: number;
  public dia_semana!: string;
}

ClaseDiasModel.init(
  {
    id_clase_dia: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_clase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ClaseModel,
        key: "id_clase",
      },
      onDelete: "CASCADE",
    },
    dia_semana: {
      type: DataTypes.ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ClaseDias",
    tableName: "CLASE_DIAS",
    timestamps: false,
  }
);

export default ClaseDiasModel;