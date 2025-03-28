import { DataTypes, Model, Association, Optional } from "sequelize";
import { sequelize } from '../config/database';
import UsuarioModel from "./usuario";
import ClaseModel from "./clase";

interface AsistenciaAttributes {
  id_asistencia: number;
  id_estudiante: number;
  id_clase: number;
  estatus: string;
  fecha_hora: Date;

  // Propiedad opcional para la relación con ClaseModel
  Clase?: ClaseModel;
}
interface AsistenciaCreationAttributes extends Optional<AsistenciaAttributes, "id_asistencia"> {}

class AsistenciaModel extends Model<AsistenciaAttributes> implements AsistenciaAttributes {
  public id_asistencia!: number;
  public id_estudiante!: number;
  public id_clase!: number;
  public estatus!: string;
  public fecha_hora!: Date;

  // Propiedad para la asociación con ClaseModel
  public Clase?: ClaseModel;

  public static associations: {
    Clase: Association<AsistenciaModel, ClaseModel>;
  };
}

AsistenciaModel.init(
  {
    id_asistencia: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UsuarioModel,
        key: "id_usuario",
      },
      onDelete: "CASCADE",
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
    estatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['Presente', 'Ausente', 'Tarde']],
      },
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Asistencia",
    tableName: "ASISTENCIA",
    timestamps: false,
  }
);

// Definir la asociación con ClaseModel
AsistenciaModel.belongsTo(ClaseModel, { foreignKey: "id_clase", as: "Clase" });

export default AsistenciaModel;