import { Router } from "express";
import inscripcionController from "../controllers/inscripcionController";
import authMiddleware from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.post("/inscripciones", authMiddleware, roleMiddleware([2]), inscripcionController.createInscripcion as any);
router.post("/inscripciones", authMiddleware, inscripcionController.getAllInscripciones);
router.post("/inscripciones/detalle", authMiddleware, inscripcionController.getInscripcion);
router.delete("/inscripciones/:id", authMiddleware, inscripcionController.deleteInscripcion);
router.post("/inscripciones/clase", authMiddleware, roleMiddleware([1]), inscripcionController.getAlumnosPorClase as any);
router.post("/clases/alumno", authMiddleware, roleMiddleware([2]), inscripcionController.getClasesPorAlumno as any);

export default router;