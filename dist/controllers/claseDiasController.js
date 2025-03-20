"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const claseDias_1 = __importDefault(require("../models/claseDias"));
const claseDiasController = {
    createClaseDia: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newClaseDia = yield claseDias_1.default.create(req.body);
            res.status(201).json(newClaseDia);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getAllClaseDias: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claseDias = yield claseDias_1.default.findAll();
            res.status(200).json(claseDias);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getClaseDia: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claseDia = yield claseDias_1.default.findByPk(req.params.id);
            if (claseDia) {
                res.status(200).json(claseDia);
            }
            else {
                res.status(404).json({ message: "ClaseDia no encontrada" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    updateClaseDia: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [updated] = yield claseDias_1.default.update(req.body, { where: { id_clase_dia: req.params.id } });
            if (updated) {
                const updatedClaseDia = yield claseDias_1.default.findByPk(req.params.id);
                res.status(200).json(updatedClaseDia);
            }
            else {
                res.status(404).json({ message: "ClaseDia no encontrada" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    deleteClaseDia: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deleted = yield claseDias_1.default.destroy({ where: { id_clase_dia: req.params.id } });
            if (deleted) {
                res.status(200).json({ message: "ClaseDia eliminada exitosamente" });
            }
            else {
                res.status(404).json({ message: "ClaseDia no encontrada" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
};
exports.default = claseDiasController;
