"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = __importDefault(require("../controllers/usuarioController"));
const router = (0, express_1.Router)();
router.post("/usuarios", usuarioController_1.default.createUsuario);
router.get("/usuarios", usuarioController_1.default.getAllUsuarios);
router.get("/usuarios/:id", usuarioController_1.default.getUsuario);
router.put("/usuarios/:id", usuarioController_1.default.updateUsuario);
router.patch("/usuarios/:id", usuarioController_1.default.partialUpdateUsuario);
router.delete("/usuarios/:id", usuarioController_1.default.deleteUsuario);
exports.default = router;
