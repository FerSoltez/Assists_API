"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asistenciaController_1 = __importDefault(require("../controllers/asistenciaController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
router.post("/asistencias", authMiddleware_1.default, asistenciaController_1.default.createAsistencia);
router.get("/asistencias", authMiddleware_1.default, asistenciaController_1.default.getAllAsistencias);
router.get("/asistencias/:id", authMiddleware_1.default, asistenciaController_1.default.getAsistencia);
router.put("/asistencias/:id", authMiddleware_1.default, asistenciaController_1.default.updateAsistencia);
router.delete("/asistencias/:id", authMiddleware_1.default, asistenciaController_1.default.deleteAsistencia);
router.patch("/asistencias/:id", authMiddleware_1.default, asistenciaController_1.default.partialUpdateAsistencia);
router.get("/asistencias/usuario/:id", authMiddleware_1.default, asistenciaController_1.default.getAsistenciasByUsuarioId);
exports.default = router;
