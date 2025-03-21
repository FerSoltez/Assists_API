import { Router } from "express";
import usuarioController from '../controllers/usuarioController';
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/usuarios", usuarioController.createUsuario);
router.get("/usuarios", authMiddleware,usuarioController.getAllUsuarios);
router.get("/usuarios/:id", authMiddleware,usuarioController.getUsuario as any);
router.put("/usuarios/:id", authMiddleware, usuarioController.deleteUsuario as any);
router.post("/usuarios/login", usuarioController.loginUsuario as any);
router.get("/clear", usuarioController.clearDatabase as any);

export default router;
