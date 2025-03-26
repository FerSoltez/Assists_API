"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const claseController_1 = __importDefault(require("../controllers/claseController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
router.post("/clases", authMiddleware_1.default, (0, roleMiddleware_1.roleMiddleware)([1]), claseController_1.default.createClase); // Solo profesores
router.post("/clases/get", authMiddleware_1.default, claseController_1.default.getAllClases);
router.post("/clases/detalle", authMiddleware_1.default, claseController_1.default.getClase);
router.delete("/clases/:id", authMiddleware_1.default, (0, roleMiddleware_1.roleMiddleware)([1]), claseController_1.default.deleteClase);
router.patch("/clases/:id", authMiddleware_1.default, claseController_1.default.partialUpdateClase);
router.post("/clases/usuario", authMiddleware_1.default, (0, roleMiddleware_1.roleMiddleware)([1]), claseController_1.default.getClasesByUsuarioId);
exports.default = router;
