import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import ClaseDias from "./claseDias";
import UsuarioModel from "./usuario";
import Inscripcion from "./inscripcion"; // Import the Inscripcion model

interface ClaseAttributes {
  id_clase: number;
  nombre_clase: string;
  descripcion?: string; // Nuevo campo opcional
  horario: Date;
  duracion: number;
  id_profesor: number;
  codigo_clase: string;
}

interface ClaseCreationAttributes extends Optional<ClaseAttributes, "id_clase" | "codigo_clase"> {}

class ClaseModel extends Model<ClaseAttributes, ClaseCreationAttributes> implements ClaseAttributes {
  public id_clase!: number;
  public nombre_clase!: string;
  public descripcion?: string; // Nuevo campo opcional
  public horario!: Date;
  public duracion!: number;
  public id_profesor!: number;
  public codigo_clase!: string;
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
    descripcion: {
      type: DataTypes.TEXT, // Nuevo campo
      allowNull: true, // Es opcional
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
    codigo_clase: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
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

ClaseModel.belongsTo(UsuarioModel, { foreignKey: "id_profesor", as: "Profesor" }); 
ClaseModel.hasMany(Inscripcion, { foreignKey: "id_clase", as: "Inscripciones" });


export default ClaseModel;