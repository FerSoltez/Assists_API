"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const claseDiasController_1 = __importDefault(require("../controllers/claseDiasController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
router.post("/clase-dias", authMiddleware_1.default, claseDiasController_1.default.createClaseDia);
router.get("/clase-dias/get", authMiddleware_1.default, claseDiasController_1.default.getAllClaseDias);
router.get("/clase-dias/:id", authMiddleware_1.default, claseDiasController_1.default.getClaseDia);
router.patch("/clase-dias/:id", authMiddleware_1.default, claseDiasController_1.default.updateClaseDia);
router.delete("/clase-dias/:id", authMiddleware_1.default, claseDiasController_1.default.deleteClaseDia);
exports.default = router;
