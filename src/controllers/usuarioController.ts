import { Request, Response } from "express";
import Usuarios from "../models/usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const usuarioController = {
  createUsuario: async (req: Request, res: Response) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUsuario = await Usuarios.create({ ...req.body, password: hashedPassword, intentos: 3 });
      res.status(201).json(newUsuario);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  loginUsuario: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const usuario = await Usuarios.findOne({ where: { email } });

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (usuario.intentos === 0) {
        return res.status(403).json({ message: "Cuenta bloqueada. Contacte al administrador." });
      }

      const isPasswordValid = await bcrypt.compare(password, usuario.contrasena);
      if (!isPasswordValid) {
        await Usuarios.update({ intentos: usuario.intentos - 1 }, { where: { id_usuario: usuario.id_usuario } });
        return res.status(401).json({ message: "Contraseña incorrecta. Intentos restantes: " + (usuario.intentos - 1) });
      }

      await Usuarios.update({ intentos: 3 }, { where: { id_usuario: usuario.id_usuario } });

      const token = jwt.sign({ id: usuario.id_usuario }, "your_jwt_secret", { expiresIn: "1h" });

      res.status(200).json({ 
        message: "Inicio de sesión exitoso", 
        token,
        usuario: {
          id: usuario.id_usuario,
          email: usuario.email,
          nombre: usuario.nombre,
          tipo: usuario.id_tipo
        }
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getAllUsuarios: async (req: Request, res: Response) => {
    try {
      const usuarios = await Usuarios.findAll();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getUsuario: async (req: Request, res: Response) => {
    try {
      const usuario = await Usuarios.findByPk(req.params.id);
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  updateUsuario: async (req: Request, res: Response) => {
    try {
      const [updated] = await Usuarios.update(req.body, { where: { id_usuario: req.params.id } });
      if (updated) {
        const updatedUsuario = await Usuarios.findByPk(req.params.id);
        res.status(200).json(updatedUsuario);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  deleteUsuario: async (req: Request, res: Response) => {
    try {
      const deleted = await Usuarios.destroy({ where: { id_usuario: req.params.id } });
      if (deleted) {
        res.status(200).json({ message: "Usuario eliminado exitosamente" });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  partialUpdateUsuario: async (req: Request, res: Response) => {    try {
      const usuario = await Usuarios.findByPk(req.params.id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      await Usuarios.update(req.body, { where: { id_usuario: req.params.id } });
      const updatedUsuario = await Usuarios.findByPk(req.params.id);
      res.status(200).json(updatedUsuario);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
};

export default usuarioController;
