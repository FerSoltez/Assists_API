import { Router } from "express";
import inscripcionController from "../controllers/inscripcionController";
import authMiddleware from "../middleware/authMiddleware";
import verifyOwnershipClase from "../middleware/verifyOwnershipClase";

const router = Router();

router.post("/inscripciones", authMiddleware, inscripcionController.createInscripcion as any);
router.get("/inscripciones", authMiddleware, inscripcionController.getAllInscripciones);
router.get("/inscripciones/:id", authMiddleware, inscripcionController.getInscripcion);
router.delete("/inscripciones/:id", authMiddleware, inscripcionController.deleteInscripcion);
router.get("/inscripciones/clase/:id_clase", authMiddleware, verifyOwnershipClase, inscripcionController.getAlumnosPorClase as any);

export default router;