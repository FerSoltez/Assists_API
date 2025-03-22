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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asistencia_1 = __importDefault(require("../models/asistencia"));
const asistenciaController = {
    createAsistencia: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newAsistencia = yield asistencia_1.default.create(req.body);
            res.status(201).json(newAsistencia);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getAllAsistencias: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const asistencias = yield asistencia_1.default.findAll();
            res.status(200).json(asistencias);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getAsistencia: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const asistencia = yield asistencia_1.default.findByPk(req.params.id);
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
            const { id } = req.params;
            // Verificar si la asistencia pertenece al usuario autenticado
            const asistencia = yield asistencia_1.default.findByPk(id);
            if (!asistencia) {
                return res.status(404).json({ message: "Asistencia no encontrada" });
            }
            if (asistencia.id_estudiante !== userId) {
                return res.status(403).json({ message: "Acceso denegado. No puedes eliminar una asistencia que no te pertenece." });
            }
            const deleted = yield asistencia_1.default.destroy({ where: { id_asistencia: id } });
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
            const { id } = req.params;
            // Verificar si el usuario autenticado está intentando acceder a sus propias asistencias
            if (parseInt(id) !== userId) {
                return res.status(403).json({ message: "Acceso denegado. No puedes ver las asistencias de otro usuario." });
            }
            const asistencias = yield asistencia_1.default.findAll({ where: { id_estudiante: id } });
            res.status(200).json(asistencias);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
};
exports.default = asistenciaController;
