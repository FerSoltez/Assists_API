import { Router } from "express";
import usuarioController from '../controllers/usuarioController';

const router = Router();

router.post("/usuarios", usuarioController.createUsuario);
router.get("/usuarios", usuarioController.getAllUsuarios);
router.get("/usuarios/:id", usuarioController.getUsuario);
router.put("/usuarios/:id", usuarioController.updateUsuario);
router.patch("/usuarios/:id", usuarioController.partialUpdateUsuario as any);
router.delete("/usuarios/:id", usuarioController.deleteUsuario);

export default router;
