import { Router } from "express";
import asistenciaController from "../controllers/asistenciaController";
import authMiddleware from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.post("/asistencias", authMiddleware, roleMiddleware([1]), asistenciaController.createAsistencia); // Solo profesores
router.patch("/asistencias/:id", authMiddleware, asistenciaController.updateAsistencia);
router.delete("/asistencias/:id", authMiddleware, roleMiddleware([2]), asistenciaController.deleteAsistencia as any);
router.patch("/asistencias/:id", authMiddleware, asistenciaController.partialUpdateAsistencia as any);
router.post("/asistencias/usuario", authMiddleware, asistenciaController.getAsistenciasByUsuarioId as any);

export default router;