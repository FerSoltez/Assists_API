import { Router } from "express";
import asistenciaController from "../controllers/asistenciaController";

const router = Router();

router.post("/asistencias", asistenciaController.createAsistencia);
router.get("/asistencias", asistenciaController.getAllAsistencias);
router.get("/asistencias/:id", asistenciaController.getAsistencia);
router.put("/asistencias/:id", asistenciaController.updateAsistencia);
router.delete("/asistencias/:id", asistenciaController.deleteAsistencia);
router.patch("/asistencias/:id", asistenciaController.partialUpdateAsistencia as any);

export default router;