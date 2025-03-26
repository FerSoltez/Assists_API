"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inscripcionController_1 = __importDefault(require("../controllers/inscripcionController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
router.post("/inscripciones", authMiddleware_1.default, (0, roleMiddleware_1.roleMiddleware)([2]), inscripcionController_1.default.createInscripcion);
router.post("/inscripciones/get", authMiddleware_1.default, inscripcionController_1.default.getAllInscripciones);
router.post("/inscripciones/detalle", authMiddleware_1.default, inscripcionController_1.default.getInscripcion);
router.delete("/inscripciones/:id", authMiddleware_1.default, inscripcionController_1.default.deleteInscripcion);
router.post("/inscripciones/clase", authMiddleware_1.default, (0, roleMiddleware_1.roleMiddleware)([1]), inscripcionController_1.default.getAlumnosPorClase);
router.post("/clases/alumno", authMiddleware_1.default, (0, roleMiddleware_1.roleMiddleware)([2]), inscripcionController_1.default.getClasesPorAlumno);
exports.default = router;
