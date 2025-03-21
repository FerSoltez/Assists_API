import { Router } from "express";
import claseController from "../controllers/claseController";
import authMiddleware from "../middleware/authMiddleware";
import verifyOwnership from "../middleware/verifyOwnership";

const router = Router();

router.post("/clases", authMiddleware, verifyOwnership, claseController.createClase);
router.get("/clases", authMiddleware, verifyOwnership, claseController.getAllClases);
router.get("/clases/:id", authMiddleware, verifyOwnership, claseController.getClase);
router.put("/clases/:id", authMiddleware, verifyOwnership, claseController.updateClase);
router.delete("/clases/:id", authMiddleware, verifyOwnership, claseController.deleteClase);
router.patch("/clases/:id", authMiddleware, verifyOwnership, claseController.partialUpdateClase as any);
router.get("/clases/usuario/:id", authMiddleware, verifyOwnership, claseController.getClasesByUsuarioId);

export default router;