"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const clase_1 = __importDefault(require("./clase"));
const usuario_1 = __importDefault(require("./usuario"));
class Inscripcion extends sequelize_1.Model {
}
Inscripcion.init({
    id_inscripcion: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    id_estudiante: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: usuario_1.default,
            key: "id_usuario",
        },
        onDelete: "CASCADE",
    },
    fecha_inscripcion: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: "Inscripcion",
    tableName: "INSCRIPCION",
    timestamps: false,
});
// Relación con Usuario
Inscripcion.belongsTo(usuario_1.default, { foreignKey: "id_estudiante" });
usuario_1.default.hasMany(Inscripcion, { foreignKey: "id_estudiante" });
// Relación con Clase
Inscripcion.belongsTo(clase_1.default, { foreignKey: "id_clase" });
clase_1.default.hasMany(Inscripcion, { foreignKey: "id_clase" });
exports.default = Inscripcion;
