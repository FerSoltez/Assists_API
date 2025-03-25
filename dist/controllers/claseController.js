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
const clase_1 = __importDefault(require("../models/clase"));
const claseDias_1 = __importDefault(require("../models/claseDias"));
const inscripcion_1 = __importDefault(require("../models/inscripcion"));
const usuario_1 = __importDefault(require("../models/usuario")); // Import the Usuarios model
const claseController = {
    createClase: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { nombre_clase, horario, duracion, id_profesor, dias } = req.body;
            // Generar un código aleatorio de 6 dígitos
            const codigo_clase = Math.random().toString(36).substring(2, 8).toUpperCase();
            // Crear la clase
            const newClase = yield clase_1.default.create({ nombre_clase, horario, duracion, id_profesor, codigo_clase });
            // Crear los registros en CLASE_DIAS si se proporcionan días
            if (dias && Array.isArray(dias)) {
                const claseDiasData = dias.map((dia) => ({
                    id_clase: newClase.id_clase,
                    dia_semana: dia,
                }));
                yield claseDias_1.default.bulkCreate(claseDiasData);
            }
            // Obtener la clase con los días asociados
            const claseConDias = yield clase_1.default.findByPk(newClase.id_clase, {
                include: [{ model: claseDias_1.default }],
            });
            res.status(201).json(claseConDias);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getAllClases: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const clases = yield clase_1.default.findAll();
            res.status(200).json(clases);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getClase: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const clase = yield clase_1.default.findByPk(req.params.id);
            if (clase) {
                res.status(200).json(clase);
            }
            else {
                res.status(404).json({ message: "Clase no encontrada" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    updateClase: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [updated] = yield clase_1.default.update(req.body, { where: { id_clase: req.params.id } });
            if (updated) {
                const updatedClase = yield clase_1.default.findByPk(req.params.id);
                res.status(200).json(updatedClase);
            }
            else {
                res.status(404).json({ message: "Clase no encontrada" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    deleteClase: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }
            const userId = req.user.id; // ID del usuario autenticado extraído del token
            const { id } = req.params;
            // Verificar si la clase pertenece al usuario autenticado
            const clase = yield clase_1.default.findByPk(id);
            if (!clase) {
                return res.status(404).json({ message: "Clase no encontrada" });
            }
            if (clase.id_profesor !== userId) {
                return res.status(403).json({ message: "Acceso denegado. No puedes eliminar una clase que no te pertenece." });
            }
            // Eliminar los días asociados en CLASE_DIAS
            yield claseDias_1.default.destroy({ where: { id_clase: id } });
            // Eliminar la clase en CLASE
            const deleted = yield clase_1.default.destroy({ where: { id_clase: id } });
            if (deleted) {
                res.status(200).json({ message: "Clase y sus días asociados eliminados exitosamente" });
            }
            else {
                res.status(404).json({ message: "Clase no encontrada" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    partialUpdateClase: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }
            const userId = req.user.id; // ID del usuario autenticado extraído del token
            const { id } = req.params;
            // Verificar si la clase pertenece al usuario autenticado
            const clase = yield clase_1.default.findByPk(id);
            if (!clase) {
                return res.status(404).json({ message: "Clase no encontrada" });
            }
            if (clase.id_profesor !== userId) {
                return res.status(403).json({ message: "Acceso denegado. No puedes actualizar una clase que no te pertenece." });
            }
            yield clase_1.default.update(req.body, { where: { id_clase: id } });
            const updatedClase = yield clase_1.default.findByPk(id);
            res.status(200).json(updatedClase);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getClasesByUsuarioId: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }
            const userId = req.user.id; // ID del usuario autenticado extraído del token
            const { id } = req.params;
            // Verificar si el usuario autenticado está intentando acceder a sus propias clases
            if (parseInt(id) !== userId) {
                return res.status(403).json({ message: "Acceso denegado. No puedes ver las clases de otro usuario." });
            }
            // Obtener el usuario autenticado
            const usuario = yield usuario_1.default.findOne({ where: { id_usuario: id } });
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            let clases;
            if (usuario.id_tipo === "1") {
                // Si el usuario es un profesor (id_tipo = 1), obtener las clases que le pertenecen
                clases = yield clase_1.default.findAll({ where: { id_profesor: id } });
            }
            else if (usuario.id_tipo === "2") {
                // Si el usuario es un alumno (id_tipo = 2), obtener las clases en las que está inscrito
                clases = yield clase_1.default.findAll({
                    include: [
                        {
                            model: inscripcion_1.default, // Modelo de inscripción
                            where: { id_alumno: id }, // Relación con el alumno
                        },
                    ],
                });
            }
            else {
                return res.status(400).json({ message: "Tipo de usuario no válido" });
            }
            res.status(200).json(clases);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
};
exports.default = claseController;
