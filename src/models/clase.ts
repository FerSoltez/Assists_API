import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ClaseAttributes {
  id_clase: number;
  nombre_clase: string;
  horario: Date;
  duracion: number;
  id_profesor: number;
}

// Define una interfaz para los atributos opcionales al crear una nueva instancia
interface ClaseCreationAttributes extends Optional<ClaseAttributes, "id_clase"> {}

class ClaseModel extends Model<ClaseAttributes, ClaseCreationAttributes> implements ClaseAttributes {
  public id_clase!: number;
  public nombre_clase!: string;
  public horario!: Date;
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
      type: DataTypes.DATE,
      allowNull: false,
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_profesor: {
      type: DataTypes.INTEGER,
      allowNull: false,
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