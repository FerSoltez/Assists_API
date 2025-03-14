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
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email y contraseña son requeridos" });
            }
            const usuario = yield usuario_1.default.findOne({ where: { email } });
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            if (usuario.intentos === 0) {
                return res.status(403).json({ message: "Cuenta bloqueada. Contacte al administrador." });
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, usuario.contrasena);
            if (!isPasswordValid) {
                yield usuario_1.default.update({ intentos: usuario.intentos - 1 }, { where: { id_usuario: usuario.id_usuario } });
                return res.status(401).json({ message: "Contraseña incorrecta. Intentos restantes: " + (usuario.intentos - 1) });
            }
            yield usuario_1.default.update({ intentos: 3 }, { where: { id_usuario: usuario.id_usuario } });
            const token = jsonwebtoken_1.default.sign({ id: usuario.id_usuario }, "your_jwt_secret", { expiresIn: "1h" });
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
            const usuario = yield usuario_1.default.findByPk(req.params.id);
            if (usuario) {
                res.status(200).json(usuario);
            }
            else {
                res.status(404).json({ message: "Usuario no encontrado" });
            }
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
            const deleted = yield usuario_1.default.destroy({ where: { id_usuario: req.params.id } });
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
            const usuario = yield usuario_1.default.findByPk(req.params.id);
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            yield usuario_1.default.update(req.body, { where: { id_usuario: req.params.id } });
            const updatedUsuario = yield usuario_1.default.findByPk(req.params.id);
            res.status(200).json(updatedUsuario);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
};
exports.default = usuarioController;
