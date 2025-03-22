import { Router } from "express";
import asistenciaController from "../controllers/asistenciaController";
import authMiddleware from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.post("/asistencias", authMiddleware, roleMiddleware([1]), asistenciaController.createAsistencia); // Solo profesores
router.get("/asistencias", authMiddleware, asistenciaController.getAllAsistencias);
router.get("/asistencias/:id", authMiddleware, asistenciaController.getAsistencia);
router.put("/asistencias/:id", authMiddleware, asistenciaController.updateAsistencia);
router.delete("/asistencias/:id", authMiddleware, asistenciaController.deleteAsistencia as any);
router.patch("/asistencias/:id", authMiddleware, asistenciaController.partialUpdateAsistencia as any);
router.get("/asistencias/usuario/:id", authMiddleware, asistenciaController.getAsistenciasByUsuarioId as any);

export default router;