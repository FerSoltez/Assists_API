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
            const { token, nuevaContrasena } = req.body;
            if (!token || !nuevaContrasena) {
                return res.status(400).json({ message: "Token y nueva contraseña son requeridos" });
            }
            // Verificar el token
            let email;
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret_key');
                email = decoded.email;
            }
            catch (error) {
                return res.status(400).json({ message: "Token inválido o expirado" });
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
            const usuario = yield usuario_1.default.findOne({ where: { email } });
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }
            const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
            const mailOptions = {
                from: '"Soporte Assists" <tu_correo@gmail.com>',
                to: email,
                subject: "Cambio de Contraseña",
                html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #1a1a1a; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">ASSISTS</h1>
            </div>
            
            <div style="padding: 30px; line-height: 1.6;">
              <div style="font-size: 24px; font-weight: 600; margin-bottom: 20px; text-align: center; color: #333;">Cambio de Contraseña</div>
              
              <p style="margin-bottom: 15px;">Hola, ${usuario.nombre},</p>
              
              <p style="margin-bottom: 20px;">Hemos recibido una solicitud para cambiar tu contraseña. Para continuar con este proceso, haz clic en el siguiente botón:</p>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="https://assists-api.onrender.com/cambiarContrasena.html?token=${token}" style="display: inline-block; background-color: #1a1a1a; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: 500;">Cambiar Contraseña</a>
              </div>
              
              <div style="margin-top: 25px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; font-size: 14px;">
                <p style="margin-top: 0;">Si no solicitaste este cambio, puedes ignorar este correo. Tu cuenta seguirá segura.</p>
                <p style="margin-bottom: 0;">Por razones de seguridad, este enlace expirará en 24 horas.</p>
              </div>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 14px; color: #666;">
              <p style="margin: 0;">&copy; 2025 Assists. Todos los derechos reservados.</p>
            </div>
          </div>
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
