"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asistencia_1 = __importDefault(require("../models/asistencia"));
const clase_1 = __importDefault(require("../models/clase")); // Import the ClaseModel
const sequelize_1 = require("sequelize"); // Importar operadores de Sequelize
const asistenciaController = {
    createAsistencia: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id_estudiante, id_clase, fecha_hora, estatus } = req.body;
            // Convertir la fecha enviada en un objeto Date
            const fechaRecibida = new Date(fecha_hora);
            fechaRecibida.setHours(0, 0, 0, 0); // Ajustar a las 00:00:00 para comparar solo la fecha
            // Verificar si ya existe una asistencia para el estudiante en la clase en la misma fecha
            const asistenciaExistente = yield asistencia_1.default.findOne({
                where: {
                    id_estudiante,
                    id_clase,
                    fecha_hora: {
                        [sequelize_1.Op.gte]: fechaRecibida, // Desde las 00:00 del día
                        [sequelize_1.Op.lt]: new Date(fechaRecibida.getTime() + 24 * 60 * 60 * 1000), // Hasta antes de las 00:00 del siguiente día
                    },
                },
            });
            if (asistenciaExistente) {
                return res.status(400).json({ error: "El estudiante ya tiene una asistencia registrada para hoy en esta clase." });
            }
            // Crear la nueva asistencia si no existe una previa
            const newAsistencia = yield asistencia_1.default.create({
                id_estudiante,
                id_clase,
                estatus,
                fecha_hora: new Date(fecha_hora),
            }); // <-- Asegura que coincide con la interfaz
            res.status(201).json(newAsistencia);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getAsistencia: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.body; // Cambiado a req.body
            const asistencia = yield asistencia_1.default.findByPk(id);
            if (asistencia) {
                res.status(200).json(asistencia);
            }
            else {
                res.status(404).json({ message: "Asistencia no encontrada" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    updateAsistencia: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [updated] = yield asistencia_1.default.update(req.body, { where: { id_asistencia: req.params.id } });
            if (updated) {
                const updatedAsistencia = yield asistencia_1.default.findByPk(req.params.id);
                res.status(200).json(updatedAsistencia);
            }
            else {
                res.status(404).json({ message: "Asistencia no encontrada" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    deleteAsistencia: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }
            const userId = req.user.id; // ID del usuario autenticado extraído del token
            const { id } = req.params; // ID de la clase
            // Verificar si existe una asistencia para el usuario autenticado y la clase especificada
            const asistencia = yield asistencia_1.default.findOne({
                where: { id_estudiante: userId, id_clase: id },
            });
            if (!asistencia) {
                return res.status(404).json({ message: "Asistencia no encontrada" });
            }
            // Eliminar la asistencia
            const deleted = yield asistencia_1.default.destroy({
                where: { id_estudiante: userId, id_clase: id },
            });
            if (deleted) {
                res.status(200).json({ message: "Asistencia eliminada exitosamente" });
            }
            else {
                res.status(404).json({ message: "Asistencia no encontrada" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    partialUpdateAsistencia: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }
            const userId = req.user.id; // ID del usuario autenticado extraído del token
            const { id } = req.params;
            // Verificar si la asistencia pertenece al usuario autenticado
            const asistencia = yield asistencia_1.default.findByPk(id);
            if (!asistencia) {
                return res.status(404).json({ message: "Asistencia no encontrada" });
            }
            if (asistencia.id_estudiante !== userId) {
                return res.status(403).json({ message: "Acceso denegado. No puedes actualizar una asistencia que no te pertenece." });
            }
            yield asistencia_1.default.update(req.body, { where: { id_asistencia: id } });
            const updatedAsistencia = yield asistencia_1.default.findByPk(id);
            res.status(200).json(updatedAsistencia);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getAsistenciasByUsuarioId: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }
            const userId = req.user.id; // ID del usuario autenticado extraído del token
            const { id } = req.body; // Cambiado a req.body
            // Verificar si el usuario autenticado está intentando acceder a sus propias asistencias
            if (parseInt(id) !== userId) {
                return res.status(403).json({ message: "Acceso denegado. No puedes ver las asistencias de otro usuario." });
            }
            // Obtener las asistencias del estudiante con el nombre de la clase
            const asistencias = yield asistencia_1.default.findAll({
                where: { id_estudiante: id },
                include: [
                    {
                        model: clase_1.default, // Relación con el modelo Clase
                        as: "Clase", // Especificar el alias definido en la relación
                        attributes: ["nombre_clase"], // Solo incluir el nombre de la clase
                    },
                ],
            });
            // Transformar los datos para incluir el nombre de la clase en el nivel superior y eliminar la redundancia
            const resultado = asistencias.map((asistencia) => {
                const asistenciaJSON = asistencia.toJSON();
                const { Clase } = asistenciaJSON, resto = __rest(asistenciaJSON, ["Clase"]); // Extraer Clase y el resto de las propiedades
                return Object.assign(Object.assign({}, resto), { nombre_clase: Clase === null || Clase === void 0 ? void 0 : Clase.nombre_clase });
            });
            res.status(200).json(resultado);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
};
exports.default = asistenciaController;
