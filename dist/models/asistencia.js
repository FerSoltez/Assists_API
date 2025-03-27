"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const usuario_1 = __importDefault(require("./usuario"));
const clase_1 = __importDefault(require("./clase"));
class AsistenciaModel extends sequelize_1.Model {
}
AsistenciaModel.init({
    id_asistencia: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_estudiante: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: usuario_1.default,
            key: "id_usuario",
        },
        onDelete: "CASCADE",
    },
    id_clase: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: clase_1.default,
            key: "id_clase",
        },
        onDelete: "CASCADE",
    },
    estatus: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['Presente', 'Ausente', 'Tarde']],
        },
    },
    fecha_hora: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: "Asistencia",
    tableName: "ASISTENCIA",
    timestamps: false,
});
// Definir la asociación con ClaseModel
AsistenciaModel.belongsTo(clase_1.default, { foreignKey: "id_clase", as: "Clase" });
exports.default = AsistenciaModel;
