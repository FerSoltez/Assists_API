"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const claseDias_1 = __importDefault(require("./claseDias"));
class ClaseModel extends sequelize_1.Model {
}
// Inicializar el modelo
ClaseModel.init({
    id_clase: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_clase: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    horario: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    duracion: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    id_profesor: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: "Clase",
    tableName: "CLASE",
    timestamps: false,
});
// Configurar la asociación
ClaseModel.hasMany(claseDias_1.default, { foreignKey: "id_clase", onDelete: "CASCADE" });
claseDias_1.default.belongsTo(ClaseModel, { foreignKey: "id_clase" });
exports.default = ClaseModel;
