import { Request, Response } from "express";
import Usuarios from "../models/usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Asistencia from "../models/asistencia";
import Clase from "../models/clase";
import Usuario from "../models/usuario";
import ClaseDias from "../models/claseDias";
import Inscripcion from "../models/inscripcion";

const usuarioController = {
  createUsuario: async (req: Request, res: Response) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.contrasena, 10);
      const newUsuario = await Usuarios.create({ ...req.body, contrasena: hashedPassword, intentos: 3 });
      res.status(201).json(newUsuario);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  loginUsuario: async (req: Request, res: Response) => {
    try {
      const { email, contrasena } = req.body;
  
      if (!email || !contrasena) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
      }
  
      const usuario = await Usuarios.findOne({ where: { email } });
  
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      if (usuario.intentos === 0) {
        return res.status(403).json({ message: "Cuenta bloqueada. Contacte al administrador." });
      }
  
      const isPasswordValid = await bcrypt.compare(contrasena, usuario.contrasena);
      if (!isPasswordValid) {
        await Usuarios.update({ intentos: usuario.intentos - 1 }, { where: { id_usuario: usuario.id_usuario } });
        return res.status(401).json({ message: "Contraseña incorrecta. Intentos restantes: " + (usuario.intentos - 1) });
      }
  
      await Usuarios.update({ intentos: 3 }, { where: { id_usuario: usuario.id_usuario } });
  
      const token = jwt.sign({ id: usuario.id_usuario, id_tipo: usuario.id_tipo }, "your_jwt_secret", { expiresIn: "1h" });
  
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
      if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const userId = (req.user as jwt.JwtPayload).id; // ID del usuario autenticado extraído del token
      const { id } = req.params;
  
      // Verificar si el usuario autenticado está intentando acceder a sus propios datos
      if (parseInt(id) !== userId) {
        return res.status(403).json({ message: "Acceso denegado. No puedes ver los datos de otro usuario." });
      }
  
      const usuario = await Usuarios.findByPk(id);
  
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      let additionalData = {};
  
      if (Number(usuario.id_tipo) === 1) {
        // Si el usuario es un profesor (id_tipo = 1), obtener sus clases con los días
        const clases = await Clase.findAll({
          where: { id_profesor: userId }, // Filtrar clases por el ID del profesor
          include: [{ model: ClaseDias }], // Asegúrate de que ClaseDias esté correctamente definido
        });
        additionalData = { clases };
      } else if (Number(usuario.id_tipo) === 2) {
        // Si el usuario es un estudiante (id_tipo = 2), obtener sus asistencias
        const asistencias = await Asistencia.findAll({
          where: { id_estudiante: userId }, // Filtrar asistencias por el ID del estudiante
        });
        additionalData = { asistencias };
      }
  
      res.status(200).json({
        usuario,
        ...additionalData,
      });
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
      if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const userId = (req.user as jwt.JwtPayload).id; // ID del usuario autenticado extraído del token
      const { id } = req.params;
  
      // Verificar si el usuario autenticado está intentando eliminar sus propios datos
      if (parseInt(id) !== userId) {
        return res.status(403).json({ message: "Acceso denegado. No puedes eliminar los datos de otro usuario." });
      }
  
      const usuario = await Usuarios.findByPk(id);
  
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      if (Number(usuario.id_tipo) === 2) {
        await Asistencia.destroy({ where: { id_estudiante: id } });
      } else if (Number(usuario.id_tipo) === 1) {
        await Clase.destroy({ where: { id_profesor: id } });
      }
  
      const deleted = await Usuarios.destroy({ where: { id_usuario: id } });
      if (deleted) {
        res.status(200).json({ message: "Usuario eliminado exitosamente" });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  
  partialUpdateUsuario: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const userId = (req.user as jwt.JwtPayload).id; // ID del usuario autenticado extraído del token
      const { id } = req.params;
  
      // Verificar si el usuario autenticado está intentando actualizar sus propios datos
      if (parseInt(id) !== userId) {
        return res.status(403).json({ message: "Acceso denegado. No puedes actualizar los datos de otro usuario." });
      }
  
      const usuario = await Usuarios.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      await Usuarios.update(req.body, { where: { id_usuario: id } });
      const updatedUsuario = await Usuarios.findByPk(id);
      res.status(200).json(updatedUsuario);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  clearDatabase: async (req: Request, res: Response) => {
    try {
      await Clase.destroy({ where: {}, truncate: false, cascade: true });
      await Inscripcion.destroy({ where: {}, truncate: false, cascade: true });
      await ClaseDias.destroy({ where: {}, truncate: false, cascade: true });
      await Asistencia.destroy({ where: {}, truncate: false, cascade: true });
      await Usuario.destroy({ where: {}, truncate: false, cascade: true });

      res.status(200).json({ message: "Datos borrados exitosamente de todas las tablas" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
};

export default usuarioController;
