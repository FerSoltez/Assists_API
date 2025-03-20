"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const clase_1 = __importDefault(require("./clase"));
class ClaseDiasModel extends sequelize_1.Model {
}
ClaseDiasModel.init({
    id_clase_dia: {
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
    dia_semana: {
        type: sequelize_1.DataTypes.ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: "ClaseDias",
    tableName: "CLASE_DIAS",
    timestamps: false,
});
exports.default = ClaseDiasModel;
