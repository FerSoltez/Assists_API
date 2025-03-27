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
const inscripcion_1 = __importDefault(require("../models/inscripcion"));
const usuario_1 = __importDefault(require("../models/usuario"));
const clase_1 = __importDefault(require("../models/clase"));
const claseDias_1 = __importDefault(require("../models/claseDias")); // Import the ClaseDias model
const inscripcionController = {
    createInscripcion: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { codigo_clase, id_estudiante } = req.body;
            // Verificar si el código de la clase es válido
            const clase = yield clase_1.default.findOne({ where: { codigo_clase } });
            if (!clase) {
                return res.status(404).json({ message: "Código de clase inválido. No se encontró la clase." });
            }
            // Verificar si el estudiante ya está inscrito en la clase
            const inscripcionExistente = yield inscripcion_1.default.findOne({
                where: { id_clase: clase.id_clase, id_estudiante },
            });
            if (inscripcionExistente) {
                return res.status(400).json({ message: "El estudiante ya está inscrito en esta clase." });
            }
            // Crear la inscripción
            const newInscripcion = yield inscripcion_1.default.create({
                id_clase: clase.id_clase,
                id_estudiante,
            });
            res.status(201).json({
                message: "Inscripción realizada exitosamente.",
                inscripcion: newInscripcion,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getAllInscripciones: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const inscripciones = yield inscripcion_1.default.findAll();
            res.status(200).json(inscripciones);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getInscripcion: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.body; // Cambiado a req.body
            const inscripcion = yield inscripcion_1.default.findByPk(id);
            if (inscripcion) {
                res.status(200).json(inscripcion);
            }
            else {
                res.status(404).json({ message: "Inscripción no encontrada" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    deleteInscripcion: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deleted = yield inscripcion_1.default.destroy({ where: { id_inscripcion: req.params.id } });
            if (deleted) {
                res.status(200).json({ message: "Inscripción eliminada exitosamente" });
            }
            else {
                res.status(404).json({ message: "Inscripción no encontrada" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getAlumnosPorClase: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id_clase } = req.body; // Cambiado a req.body
            // Buscar las inscripciones de la clase y obtener los nombres de los estudiantes junto con la información de la clase
            const inscripciones = yield inscripcion_1.default.findAll({
                where: { id_clase },
                include: [
                    {
                        model: usuario_1.default,
                        attributes: ["id_usuario", "nombre"], // Solo traer el ID y el nombre del estudiante
                    },
                    {
                        model: clase_1.default,
                        attributes: ["id_clase", "nombre_clase", "horario", "duracion", "codigo_clase"], // Información de la clase
                    },
                ],
            });
            if (inscripciones.length === 0) {
                return res.status(404).json({ message: "No hay alumnos inscritos en esta clase." });
            }
            // Extraer la información de la clase (es la misma para todas las inscripciones)
            const clase = inscripciones[0].get("Clase");
            // Extraer los nombres de los estudiantes
            const alumnos = inscripciones.map((inscripcion) => inscripcion.get("Usuario"));
            res.status(200).json({
                clase,
                alumnos,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getClasesPorAlumno: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id_estudiante } = req.body;
            // Buscar las inscripciones del estudiante y obtener la información de las clases
            const inscripciones = yield inscripcion_1.default.findAll({
                where: { id_estudiante },
                include: [
                    {
                        model: clase_1.default,
                        attributes: ["id_clase", "nombre_clase", "horario", "duracion", "codigo_clase"],
                        include: [
                            {
                                model: claseDias_1.default,
                                attributes: ["dia_semana"],
                                as: "ClaseDias",
                            },
                            {
                                model: usuario_1.default, // Incluir el profesor
                                attributes: ["nombre"], // Solo obtener el nombre del profesor
                                as: "Profesor",
                            },
                        ],
                    },
                ],
            });
            if (inscripciones.length === 0) {
                return res.status(404).json({ message: "El estudiante no está inscrito en ninguna clase." });
            }
            // Extraer la información de las clases con la cantidad de alumnos y días
            const clases = yield Promise.all(inscripciones.map((inscripcion) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                const clase = inscripcion.get("Clase");
                // Contar la cantidad de alumnos inscritos en la clase
                const cantidadAlumnos = yield inscripcion_1.default.count({ where: { id_clase: clase.id_clase } });
                // Convertir el objeto Sequelize a JSON y eliminar ClaseDias
                const claseJSON = clase.toJSON();
                const dias = ((_a = claseJSON.ClaseDias) === null || _a === void 0 ? void 0 : _a.map((dia) => dia.dia_semana)) || []; // Extraer los días de la clase
                delete claseJSON.ClaseDias; // Eliminar ClaseDias del objeto
                // Extraer el nombre del profesor
                const nombreProfesor = ((_b = claseJSON.Profesor) === null || _b === void 0 ? void 0 : _b.nombre) || ""; // Obtener solo el nombre del profesor
                delete claseJSON.Profesor; // Eliminar la propiedad Profesor del objeto
                return Object.assign(Object.assign({}, claseJSON), { cantidadAlumnos,
                    dias,
                    nombreProfesor });
            })));
            res.status(200).json(clases);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    })
};
exports.default = inscripcionController;
