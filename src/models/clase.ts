import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import ClaseDias from "./claseDias";

interface ClaseAttributes {
  id_clase: number;
  nombre_clase: string;
  horario: Date;
  duracion: number;
  id_profesor: number;
}

interface ClaseCreationAttributes extends Optional<ClaseAttributes, "id_clase"> {}

class ClaseModel extends Model<ClaseAttributes, ClaseCreationAttributes> implements ClaseAttributes {
  public id_clase!: number;
  public nombre_clase!: string;
  public horario!: Date;
  public duracion!: number;
  public id_profesor!: number;
}

// Inicializar el modelo
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

// Configurar la asociación
ClaseModel.hasMany(ClaseDias, { foreignKey: "id_clase", onDelete: "CASCADE" });
ClaseDias.belongsTo(ClaseModel, { foreignKey: "id_clase" });

export default ClaseModel;