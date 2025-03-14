"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asistenciaController_1 = __importDefault(require("../controllers/asistenciaController"));
const router = (0, express_1.Router)();
router.post("/asistencias", asistenciaController_1.default.createAsistencia);
router.get("/asistencias", asistenciaController_1.default.getAllAsistencias);
router.get("/asistencias/:id", asistenciaController_1.default.getAsistencia);
router.put("/asistencias/:id", asistenciaController_1.default.updateAsistencia);
router.delete("/asistencias/:id", asistenciaController_1.default.deleteAsistencia);
router.patch("/asistencias/:id", asistenciaController_1.default.partialUpdateAsistencia);
exports.default = router;
