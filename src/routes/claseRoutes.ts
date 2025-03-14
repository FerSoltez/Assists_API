import { Router } from "express";
import claseController from "../controllers/claseController";

const router = Router();

router.post("/clases", claseController.createClase);
router.get("/clases", claseController.getAllClases);
router.get("/clases/:id", claseController.getClase);
router.put("/clases/:id", claseController.updateClase);
router.delete("/clases/:id", claseController.deleteClase);
router.patch("/clases/:id", claseController.partialUpdateClase as any);

export default router;