import { Router } from "express";
import inscripcionController from "../controllers/inscripcionController";
import authMiddleware from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.post("/inscripciones", authMiddleware, roleMiddleware([2]), inscripcionController.createInscripcion as any);
router.get("/inscripciones", authMiddleware, inscripcionController.getAllInscripciones);
router.get("/inscripciones/:id", authMiddleware, inscripcionController.getInscripcion);
router.delete("/inscripciones/:id", authMiddleware, inscripcionController.deleteInscripcion);
router.get("/inscripciones/clase/:id_clase", authMiddleware, roleMiddleware([1]), inscripcionController.getAlumnosPorClase as any);

export default router;