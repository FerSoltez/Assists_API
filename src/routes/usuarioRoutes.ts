import { Router } from "express";
import usuarioController from '../controllers/usuarioController';
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/usuarios", usuarioController.createUsuario);
router.get("/usuarios", authMiddleware,usuarioController.getAllUsuarios);
router.get("/usuarios/:id", authMiddleware,usuarioController.getUsuario);
router.put("/usuarios/:id", authMiddleware,usuarioController.updateUsuario);
router.patch("/usuarios/:id", authMiddleware,usuarioController.partialUpdateUsuario as any);
router.delete("/usuarios/:id", authMiddleware,usuarioController.deleteUsuario);
router.post("/usuarios/login", usuarioController.loginUsuario as any);

export default router;
