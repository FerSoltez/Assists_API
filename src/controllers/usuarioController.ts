import { Request, Response } from "express";
import Usuarios from "../models/usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Asistencia from "../models/asistencia";
import Clase from "../models/clase";
import Usuario from "../models/usuario";
import ClaseDias from "../models/claseDias";
import Inscripcion from "../models/inscripcion";
import transporter from "../utils/emailTransporter";

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

  changePassword: async (req: Request, res: Response) => {
    try {
      const { email, nuevaContrasena } = req.body;
  
      if (!email || !nuevaContrasena) {
        return res.status(400).json({ message: "Email y nueva contraseña son requeridos" });
      }
  
      const usuario = await Usuarios.findOne({ where: { email } });
  
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
  
      await Usuarios.update({ contrasena: hashedPassword }, { where: { email } });
  
      res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  sendPasswordResetEmail: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "El correo electrónico es requerido." });
      }

      const mailOptions = {
        from: '"Soporte Assists" <tu_correo@gmail.com>',
        to: email,
        subject: "Cambio de Contraseña",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #1a1a1a; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">ASSISTS</h1>
            </div>
            
            <div style="padding: 30px; line-height: 1.6;">
              <div style="font-size: 24px; font-weight: 600; margin-bottom: 20px; text-align: center; color: #333;">Cambio de Contraseña</div>
              
              <p style="margin-bottom: 15px;">Hola,</p>
              
              <p style="margin-bottom: 20px;">Hemos recibido una solicitud para cambiar tu contraseña. Para continuar con este proceso, haz clic en el siguiente botón:</p>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="https://assists-api.onrender.com/cambiarContrasena.html" style="display: inline-block; background-color: #1a1a1a; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: 500;">Cambiar Contraseña</a>
              </div>
              
              <div style="margin-top: 25px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; font-size: 14px;">
                <p style="margin-top: 0;">Si no solicitaste este cambio, puedes ignorar este correo. Tu cuenta seguirá segura.</p>
                <p style="margin-bottom: 0;">Por razones de seguridad, este enlace expirará en 24 horas.</p>
              </div>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 14px; color: #666;">
              <p style="margin: 0;">&copy; 2025 Assists. Todos los derechos reservados.</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Correo enviado exitosamente." });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
};

export default usuarioController;
