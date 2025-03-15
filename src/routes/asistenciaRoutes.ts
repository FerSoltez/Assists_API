import { Router } from "express";
import asistenciaController from "../controllers/asistenciaController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/asistencias", authMiddleware, asistenciaController.createAsistencia);
router.get("/asistencias", authMiddleware, asistenciaController.getAllAsistencias);
router.get("/asistencias/:id", authMiddleware, asistenciaController.getAsistencia);
router.put("/asistencias/:id", authMiddleware, asistenciaController.updateAsistencia);
router.delete("/asistencias/:id", authMiddleware, asistenciaController.deleteAsistencia);
router.patch("/asistencias/:id", authMiddleware, asistenciaController.partialUpdateAsistencia as any);
router.get("/asistencias/usuario/:id", authMiddleware, asistenciaController.getAsistenciasByUsuarioId);

export default router;