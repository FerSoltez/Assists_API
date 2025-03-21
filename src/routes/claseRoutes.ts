import { Router } from "express";
import claseController from "../controllers/claseController";
import authMiddleware from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.post("/clases", authMiddleware, roleMiddleware([1]), claseController.createClase); // Solo profesores
router.get("/clases", authMiddleware, claseController.getAllClases);
router.get("/clases/:id", authMiddleware, claseController.getClase);
router.put("/clases/:id", authMiddleware, claseController.updateClase);
router.delete("/clases/:id", authMiddleware, claseController.deleteClase as any);
router.patch("/clases/:id", authMiddleware, claseController.partialUpdateClase as any);
router.get("/clases/usuario/:id", authMiddleware, claseController.getClasesByUsuarioId as any);

export default router;