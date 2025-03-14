"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class UsuarioModel extends sequelize_1.Model {
}
UsuarioModel.init({
    id_usuario: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    contrasena: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    id_tipo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    intentos: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: "Usuarios",
    tableName: "USUARIO",
    timestamps: false,
});
exports.default = UsuarioModel;
