"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const claseController_1 = __importDefault(require("../controllers/claseController"));
const router = (0, express_1.Router)();
router.post("/clases", claseController_1.default.createClase);
router.get("/clases", claseController_1.default.getAllClases);
router.get("/clases/:id", claseController_1.default.getClase);
router.put("/clases/:id", claseController_1.default.updateClase);
router.delete("/clases/:id", claseController_1.default.deleteClase);
router.patch("/clases/:id", claseController_1.default.partialUpdateClase);
exports.default = router;
