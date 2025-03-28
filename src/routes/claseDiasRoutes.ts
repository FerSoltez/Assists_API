import { Router } from "express";
import claseDiasController from "../controllers/claseDiasController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/clase-dias", authMiddleware, claseDiasController.createClaseDia);
router.get("/clase-dias/get", authMiddleware, claseDiasController.getAllClaseDias);
router.get("/clase-dias/:id", authMiddleware, claseDiasController.getClaseDia);
router.patch("/clase-dias/:id", authMiddleware, claseDiasController.updateClaseDia);
router.delete("/clase-dias/:id", authMiddleware, claseDiasController.deleteClaseDia);

export default router;