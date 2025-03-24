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
const usuario_1 = __importDefault(require("../models/usuario"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asistencia_1 = __importDefault(require("../models/asistencia"));
const clase_1 = __importDefault(require("../models/clase"));
const usuario_2 = __importDefault(require("../models/usuario"));
const claseDias_1 = __importDefault(require("../models/claseDias"));
const inscripcion_1 = __importDefault(require("../models/inscripcion"));
const emailTransporter_1 = __importDefault(require("../utils/emailTransporter"));
const usuarioController = {
    createUsuario: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const hashedPassword = yield bcryptjs_1.default.hash(req.body.contrasena, 10);
            const newUsuario = yield usuario_1.default.create(Object.assign(Object.assign({}, req.body), { contrasena: hashedPassword, intentos: 3 }));
            res.status(201).json(newUsuario);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    loginUsuario: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, contrasena } = req.body;
            if (!email || !contrasena) {
                return res.status(400).json({ message: "Email y contraseña son requeridos" });
            }
            const usuario = yield usuario_1.default.findOne({ where: { email } });
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            if (usuario.intentos === 0) {
                return res.status(403).json({ message: "Cuenta bloqueada. Contacte al administrador." });
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(contrasena, usuario.contrasena);
            if (!isPasswordValid) {
                yield usuario_1.default.update({ intentos: usuario.intentos - 1 }, { where: { id_usuario: usuario.id_usuario } });
                return res.status(401).json({ message: "Contraseña incorrecta. Intentos restantes: " + (usuario.intentos - 1) });
            }
            yield usuario_1.default.update({ intentos: 3 }, { where: { id_usuario: usuario.id_usuario } });
            const token = jsonwebtoken_1.default.sign({ id: usuario.id_usuario, id_tipo: usuario.id_tipo }, "your_jwt_secret", { expiresIn: "1h" });
            res.status(200).json({
                message: "Inicio de sesión exitoso",
                token,
                usuario: {
                    id: usuario.id_usuario,
                    email: usuario.email,
                    nombre: usuario.nombre,
                    tipo: usuario.id_tipo
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getAllUsuarios: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const usuarios = yield usuario_1.default.findAll();
            res.status(200).json(usuarios);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getUsuario: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }
            const userId = req.user.id; // ID del usuario autenticado extraído del token
            const { id } = req.params;
            // Verificar si el usuario autenticado está intentando acceder a sus propios datos
            if (parseInt(id) !== userId) {
                return res.status(403).json({ message: "Acceso denegado. No puedes ver los datos de otro usuario." });
            }
            const usuario = yield usuario_1.default.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            let additionalData = {};
            if (Number(usuario.id_tipo) === 1) {
                // Si el usuario es un profesor (id_tipo = 1), obtener sus clases con los días
                const clases = yield clase_1.default.findAll({
                    where: { id_profesor: userId }, // Filtrar clases por el ID del profesor
                    include: [{ model: claseDias_1.default }], // Asegúrate de que ClaseDias esté correctamente definido
                });
                additionalData = { clases };
            }
            else if (Number(usuario.id_tipo) === 2) {
                // Si el usuario es un estudiante (id_tipo = 2), obtener sus asistencias
                const asistencias = yield asistencia_1.default.findAll({
                    where: { id_estudiante: userId }, // Filtrar asistencias por el ID del estudiante
                });
                additionalData = { asistencias };
            }
            res.status(200).json(Object.assign({ usuario }, additionalData));
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    updateUsuario: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [updated] = yield usuario_1.default.update(req.body, { where: { id_usuario: req.params.id } });
            if (updated) {
                const updatedUsuario = yield usuario_1.default.findByPk(req.params.id);
                res.status(200).json(updatedUsuario);
            }
            else {
                res.status(404).json({ message: "Usuario no encontrado" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    deleteUsuario: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }
            const userId = req.user.id; // ID del usuario autenticado extraído del token
            const { id } = req.params;
            // Verificar si el usuario autenticado está intentando eliminar sus propios datos
            if (parseInt(id) !== userId) {
                return res.status(403).json({ message: "Acceso denegado. No puedes eliminar los datos de otro usuario." });
            }
            const usuario = yield usuario_1.default.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            if (Number(usuario.id_tipo) === 2) {
                yield asistencia_1.default.destroy({ where: { id_estudiante: id } });
            }
            else if (Number(usuario.id_tipo) === 1) {
                yield clase_1.default.destroy({ where: { id_profesor: id } });
            }
            const deleted = yield usuario_1.default.destroy({ where: { id_usuario: id } });
            if (deleted) {
                res.status(200).json({ message: "Usuario eliminado exitosamente" });
            }
            else {
                res.status(404).json({ message: "Usuario no encontrado" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    partialUpdateUsuario: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }
            const userId = req.user.id; // ID del usuario autenticado extraído del token
            const { id } = req.params;
            // Verificar si el usuario autenticado está intentando actualizar sus propios datos
            if (parseInt(id) !== userId) {
                return res.status(403).json({ message: "Acceso denegado. No puedes actualizar los datos de otro usuario." });
            }
            const usuario = yield usuario_1.default.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            yield usuario_1.default.update(req.body, { where: { id_usuario: id } });
            const updatedUsuario = yield usuario_1.default.findByPk(id);
            res.status(200).json(updatedUsuario);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    clearDatabase: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield clase_1.default.destroy({ where: {}, truncate: false, cascade: true });
            yield inscripcion_1.default.destroy({ where: {}, truncate: false, cascade: true });
            yield claseDias_1.default.destroy({ where: {}, truncate: false, cascade: true });
            yield asistencia_1.default.destroy({ where: {}, truncate: false, cascade: true });
            yield usuario_2.default.destroy({ where: {}, truncate: false, cascade: true });
            res.status(200).json({ message: "Datos borrados exitosamente de todas las tablas" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    changePassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, nuevaContrasena } = req.body;
            if (!email || !nuevaContrasena) {
                return res.status(400).json({ message: "Email y nueva contraseña son requeridos" });
            }
            const usuario = yield usuario_1.default.findOne({ where: { email } });
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            const hashedPassword = yield bcryptjs_1.default.hash(nuevaContrasena, 10);
            yield usuario_1.default.update({ contrasena: hashedPassword }, { where: { email } });
            res.status(200).json({ message: "Contraseña actualizada exitosamente" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    sendPasswordResetEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "El correo electrónico es requerido." });
            }
            const mailOptions = {
                from: '"Soporte Assists" <tu_correo@gmail.com>',
                to: email,
                subject: "Cambio de Contraseña",
                html: `
          <p>Hola,</p>
          <p>Hemos recibido una solicitud para cambiar tu contraseña. Haz clic en el siguiente enlace para cambiarla:</p>
          <a href="https://assists-api.onrender.com/cambiarContrasena.html" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Cambiar Contraseña</a>
          <p>Si no solicitaste este cambio, ignora este correo.</p>
        `,
            };
            yield emailTransporter_1.default.sendMail(mailOptions);
            res.status(200).json({ message: "Correo enviado exitosamente." });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
};
exports.default = usuarioController;
