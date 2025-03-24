"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = __importDefault(require("../controllers/usuarioController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
router.post("/usuarios", usuarioController_1.default.createUsuario);
router.get("/usuarios", authMiddleware_1.default, usuarioController_1.default.getAllUsuarios);
router.get("/usuarios/:id", authMiddleware_1.default, usuarioController_1.default.getUsuario);
router.patch("/usuarios/:id", authMiddleware_1.default, usuarioController_1.default.deleteUsuario);
router.post("/usuarios/login", usuarioController_1.default.loginUsuario);
router.get("/clear", usuarioController_1.default.clearDatabase);
router.post("/usuarios/cambiarContrasena", usuarioController_1.default.changePassword);
exports.default = router;
