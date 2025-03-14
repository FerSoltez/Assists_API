"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const usuario_1 = __importDefault(require("./usuario"));
class ClaseModel extends sequelize_1.Model {
}
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
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    duracion: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    id_profesor: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: usuario_1.default,
            key: "id_usuario",
        },
        onDelete: "CASCADE",
    },
}, {
    sequelize: database_1.sequelize,
    modelName: "Clase",
    tableName: "CLASE",
    timestamps: false,
});
exports.default = ClaseModel;
