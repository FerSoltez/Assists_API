import { Request, Response } from "express";
import Clase from "../models/clase";
import ClaseDias from "../models/claseDias";
import jwt from "jsonwebtoken";
import Inscripcion from "../models/inscripcion";
import Usuarios from "../models/usuario"; // Import the Usuarios model

const claseController = {
  createClase: async (req: Request, res: Response) => {
    try {
      const { nombre_clase, horario, duracion, id_profesor, dias } = req.body;

      // Generar un código aleatorio de 6 dígitos
      const codigo_clase = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Crear la clase
      const newClase = await Clase.create({ nombre_clase, horario, duracion, id_profesor, codigo_clase });

      // Crear los registros en CLASE_DIAS si se proporcionan días
      if (dias && Array.isArray(dias)) {
        const claseDiasData = dias.map((dia: string) => ({
          id_clase: newClase.id_clase,
          dia_semana: dia,
        }));

        await ClaseDias.bulkCreate(claseDiasData);
      }

      // Obtener la clase con los días asociados
      const claseConDias = await Clase.findByPk(newClase.id_clase, {
        include: [{ model: ClaseDias }],
      });

      res.status(201).json(claseConDias);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getAllClases: async (req: Request, res: Response) => {
    try {
      const clases = await Clase.findAll();
      res.status(200).json(clases);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getClase: async (req: Request, res: Response) => {
    try {
      const clase = await Clase.findByPk(req.params.id);
      if (clase) {
        res.status(200).json(clase);
      } else {
        res.status(404).json({ message: "Clase no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  updateClase: async (req: Request, res: Response) => {
    try {
      const [updated] = await Clase.update(req.body, { where: { id_clase: req.params.id } });
      if (updated) {
        const updatedClase = await Clase.findByPk(req.params.id);
        res.status(200).json(updatedClase);
      } else {
        res.status(404).json({ message: "Clase no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  deleteClase: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const userId = (req.user as jwt.JwtPayload).id; // ID del usuario autenticado extraído del token
      const { id } = req.params;
  
      // Verificar si la clase pertenece al usuario autenticado
      const clase = await Clase.findByPk(id);
      if (!clase) {
        return res.status(404).json({ message: "Clase no encontrada" });
      }
      if (clase.id_profesor !== userId) {
        return res.status(403).json({ message: "Acceso denegado. No puedes eliminar una clase que no te pertenece." });
      }
  
      // Eliminar los días asociados en CLASE_DIAS
      await ClaseDias.destroy({ where: { id_clase: id } });
  
      // Eliminar la clase en CLASE
      const deleted = await Clase.destroy({ where: { id_clase: id } });
  
      if (deleted) {
        res.status(200).json({ message: "Clase y sus días asociados eliminados exitosamente" });
      } else {
        res.status(404).json({ message: "Clase no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  
  partialUpdateClase: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const userId = (req.user as jwt.JwtPayload).id; // ID del usuario autenticado extraído del token
      const { id } = req.params;
  
      // Verificar si la clase pertenece al usuario autenticado
      const clase = await Clase.findByPk(id);
      if (!clase) {
        return res.status(404).json({ message: "Clase no encontrada" });
      }
      if (clase.id_profesor !== userId) {
        return res.status(403).json({ message: "Acceso denegado. No puedes actualizar una clase que no te pertenece." });
      }
  
      await Clase.update(req.body, { where: { id_clase: id } });
      const updatedClase = await Clase.findByPk(id);
      res.status(200).json(updatedClase);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  
  getClasesByUsuarioId: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
  
      const userId = (req.user as jwt.JwtPayload).id; // ID del usuario autenticado extraído del token
      const { id } = req.params;
  
      // Verificar si el usuario autenticado está intentando acceder a sus propias clases
      if (parseInt(id) !== userId) {
        return res.status(403).json({ message: "Acceso denegado. No puedes ver las clases de otro usuario." });
      }
  
      // Obtener el usuario autenticado
      const usuario = await Usuarios.findOne({ where: { id_usuario: id } });
  
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      let clases;
  
      if (usuario.id_tipo === "1") {
        // Si el usuario es un profesor (id_tipo = 1), obtener las clases que le pertenecen
        clases = await Clase.findAll({ where: { id_profesor: id } });
      } else if (usuario.id_tipo === "2") {
        // Si el usuario es un alumno (id_tipo = 2), obtener las clases en las que está inscrito
        clases = await Clase.findAll({
          include: [
            {
              model: Inscripcion, // Modelo de inscripción
              where: { id_alumno: id }, // Relación con el alumno
            },
          ],
        });
      } else {
        return res.status(400).json({ message: "Tipo de usuario no válido" });
      }
  
      res.status(200).json(clases);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
};

export default claseController;