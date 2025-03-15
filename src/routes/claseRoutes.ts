import { Router } from "express";
import claseController from "../controllers/claseController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/clases", authMiddleware, claseController.createClase);
router.get("/clases", authMiddleware, claseController.getAllClases);
router.get("/clases/:id", authMiddleware, claseController.getClase);
router.put("/clases/:id", authMiddleware, claseController.updateClase);
router.delete("/clases/:id", authMiddleware, claseController.deleteClase);
router.patch("/clases/:id", authMiddleware, claseController.partialUpdateClase as any);

export default router;