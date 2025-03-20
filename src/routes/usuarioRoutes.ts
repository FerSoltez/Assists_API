import { Router } from "express";
import usuarioController from '../controllers/usuarioController';
import authMiddleware from "../middleware/authMiddleware";
import verifyOwnership from "../middleware/verifyOwnership";

const router = Router();

router.post("/usuarios", usuarioController.createUsuario);
router.get("/usuarios", authMiddleware,usuarioController.getAllUsuarios);
router.get("/usuarios/:id", authMiddleware, verifyOwnership,usuarioController.getUsuario as any);
router.put("/usuarios/:id", authMiddleware, verifyOwnership, usuarioController.updateUsuario);
router.patch("/usuarios/:id", authMiddleware, verifyOwnership, usuarioController.partialUpdateUsuario as any);
router.delete("/usuarios/:id", authMiddleware, verifyOwnership, usuarioController.deleteUsuario as any);
router.post("/usuarios/login", usuarioController.loginUsuario as any);
router.get("/clear", usuarioController.clearDatabase as any);

export default router;
