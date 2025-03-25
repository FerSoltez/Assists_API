import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import Clase from "./clase";
import Usuario from "./usuario";

interface InscripcionAttributes {
  id_inscripcion: number;
  id_clase: number;
  id_estudiante: number;
  fecha_inscripcion: Date;
}

interface InscripcionCreationAttributes extends Optional<InscripcionAttributes, "id_inscripcion" | "fecha_inscripcion"> {}

class Inscripcion extends Model<InscripcionAttributes, InscripcionCreationAttributes> implements InscripcionAttributes {
  public id_inscripcion!: number;
  public id_clase!: number;
  public id_estudiante!: number;
  public fecha_inscripcion!: Date;
}

Inscripcion.init(
  {
    id_inscripcion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_clase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Clase,
        key: "id_clase",
      },
      onDelete: "CASCADE",
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id_usuario",
      },
      onDelete: "CASCADE",
    },
    fecha_inscripcion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Inscripcion",
    tableName: "INSCRIPCION",
    timestamps: false,
  }
);

// Relación con Usuario
Inscripcion.belongsTo(Usuario, { foreignKey: "id_estudiante" });
Usuario.hasMany(Inscripcion, { foreignKey: "id_estudiante" });

// Relación con Clase
Inscripcion.belongsTo(Clase, { foreignKey: "id_clase" });
Clase.hasMany(Inscripcion, { foreignKey: "id_clase" });

export default Inscripcion;