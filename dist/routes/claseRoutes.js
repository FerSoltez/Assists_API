"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const claseController_1 = __importDefault(require("../controllers/claseController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const verifyOwnership_1 = __importDefault(require("../middleware/verifyOwnership"));
const router = (0, express_1.Router)();
router.post("/clases", authMiddleware_1.default, claseController_1.default.createClase);
router.get("/clases", authMiddleware_1.default, verifyOwnership_1.default, claseController_1.default.getAllClases);
router.get("/clases/:id", authMiddleware_1.default, claseController_1.default.getClase);
router.put("/clases/:id", authMiddleware_1.default, verifyOwnership_1.default, claseController_1.default.updateClase);
router.delete("/clases/:id", authMiddleware_1.default, verifyOwnership_1.default, claseController_1.default.deleteClase);
router.patch("/clases/:id", authMiddleware_1.default, verifyOwnership_1.default, claseController_1.default.partialUpdateClase);
router.get("/clases/usuario/:id", authMiddleware_1.default, verifyOwnership_1.default, claseController_1.default.getClasesByUsuarioId);
exports.default = router;
