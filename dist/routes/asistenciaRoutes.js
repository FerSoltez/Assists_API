"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asistenciaController_1 = __importDefault(require("../controllers/asistenciaController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
router.post("/asistencias", authMiddleware_1.default, (0, roleMiddleware_1.roleMiddleware)([1]), asistenciaController_1.default.createAsistencia); // Solo profesores
router.patch("/asistencias/:id", authMiddleware_1.default, asistenciaController_1.default.updateAsistencia);
router.delete("/asistencias/:id", authMiddleware_1.default, (0, roleMiddleware_1.roleMiddleware)([2]), asistenciaController_1.default.deleteAsistencia);
router.patch("/asistencias/:id", authMiddleware_1.default, asistenciaController_1.default.partialUpdateAsistencia);
router.post("/asistencias/usuario", authMiddleware_1.default, asistenciaController_1.default.getAsistenciasByUsuarioId);
exports.default = router;
