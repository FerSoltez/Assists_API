import { Router } from "express";
import claseController from "../controllers/claseController";
import authMiddleware from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.post("/clases", authMiddleware, roleMiddleware([1]), claseController.createClase); // Solo profesores
router.post("/clases", authMiddleware, claseController.getAllClases);
router.post("/clases/detalle", authMiddleware, claseController.getClase);
router.patch("/clases/:id", authMiddleware, claseController.updateClase);
router.delete("/clases/:id", authMiddleware, roleMiddleware([1]), claseController.deleteClase as any);
router.patch("/clases/:id", authMiddleware, claseController.partialUpdateClase as any);
router.post("/clases/usuario", authMiddleware, roleMiddleware([1]), claseController.getClasesByUsuarioId as any);

export default router;