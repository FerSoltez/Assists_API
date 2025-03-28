import { Request, Response } from "express";
import { InferAttributes, InferCreationAttributes } from "sequelize"; // Import Sequelize types
import Asistencia from "../models/asistencia";
import jwt from "jsonwebtoken";
import ClaseModel from "../models/clase"; // Import the ClaseModel
import { Op } from "sequelize"; // Importar operadores de Sequelize

type AsistenciaCreationAttributes = InferCreationAttributes<Asistencia>;
const asistenciaController = {
  createAsistencia: async (req: Request, res: Response) => {
    try {
      const { id_estudiante, id_clase, fecha_hora, estatus } = req.body;
  
      // Convertir la fecha enviada en un objeto Date
      const fechaRecibida = new Date(fecha_hora);
      fechaRecibida.setHours(0, 0, 0, 0); // Ajustar a las 00:00:00 para comparar solo la fecha
  
      // Verificar si ya existe una asistencia para el estudiante en la clase en la misma fecha
      const asistenciaExistente = await Asistencia.findOne({
        where: {
          id_estudiante,
          id_clase,
          fecha_hora: {
            [Op.gte]: fechaRecibida, // Desde las 00:00 del día
            [Op.lt]: new Date(fechaRecibida.getTime() + 24 * 60 * 60 * 1000), // Hasta antes de las 00:00 del siguiente día
          },
        },
      });
  
      if (asistenciaExistente) {
        return res.status(400).json({ error: "El estudiante ya tiene una asistencia registrada para hoy en esta clase." });
      }
  
      // Crear la nueva asistencia si no existe una previa
      const newAsistencia = await Asistencia.create({
        id_estudiante,
        id_clase,
        estatus,
        fecha_hora: new Date(fecha_hora),
      } as AsistenciaCreationAttributes); // <-- Asegura que coincide con la interfaz
  
      res.status(201).json(newAsistencia);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getAsistencia: async (req: Request, res: Response) => {
    try {
      const { id } = req.body; // Cambiado a req.body
      const asistencia = await Asistencia.findByPk(id);
      if (asistencia) {
        res.status(200).json(asistencia);
      } else {
        res.status(404).json({ message: "Asistencia no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  updateAsistencia: async (req: Request, res: Response) => {
    try {
      const [updated] = await Asistencia.update(req.body, { where: { id_asistencia: req.params.id } });
      if (updated) {
        const updatedAsistencia = await Asistencia.findByPk(req.params.id);
        res.status(200).json(updatedAsistencia);
      } else {
        res.status(404).json({ message: "Asistencia no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  deleteAsistencia: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const userId = (req.user as jwt.JwtPayload).id; // ID del usuario autenticado extraído del token
      const { id } = req.params; // ID de la clase
  
      // Verificar si existe una asistencia para el usuario autenticado y la clase especificada
      const asistencia = await Asistencia.findOne({
        where: { id_estudiante: userId, id_clase: id },
      });
      if (!asistencia) {
        return res.status(404).json({ message: "Asistencia no encontrada" });
      }
  
      // Eliminar la asistencia
      const deleted = await Asistencia.destroy({
        where: { id_estudiante: userId, id_clase: id },
      });
      if (deleted) {
        res.status(200).json({ message: "Asistencia eliminada exitosamente" });
      } else {
        res.status(404).json({ message: "Asistencia no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  
  partialUpdateAsistencia: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const userId = (req.user as jwt.JwtPayload).id; // ID del usuario autenticado extraído del token
      const { id } = req.params;
  
      // Verificar si la asistencia pertenece al usuario autenticado
      const asistencia = await Asistencia.findByPk(id);
      if (!asistencia) {
        return res.status(404).json({ message: "Asistencia no encontrada" });
      }
      if (asistencia.id_estudiante !== userId) {
        return res.status(403).json({ message: "Acceso denegado. No puedes actualizar una asistencia que no te pertenece." });
      }
  
      await Asistencia.update(req.body, { where: { id_asistencia: id } });
      const updatedAsistencia = await Asistencia.findByPk(id);
      res.status(200).json(updatedAsistencia);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  
  getAsistenciasByUsuarioId: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const userId = (req.user as jwt.JwtPayload).id; // ID del usuario autenticado extraído del token
      const { id } = req.body; // Cambiado a req.body

      // Verificar si el usuario autenticado está intentando acceder a sus propias asistencias
      if (parseInt(id) !== userId) {
        return res.status(403).json({ message: "Acceso denegado. No puedes ver las asistencias de otro usuario." });
      }

      // Obtener las asistencias del estudiante con el nombre de la clase
      const asistencias = await Asistencia.findAll({
        where: { id_estudiante: id },
        include: [
          {
            model: ClaseModel, // Relación con el modelo Clase
            as: "Clase", // Especificar el alias definido en la relación
            attributes: ["nombre_clase"], // Solo incluir el nombre de la clase
          },
        ],
      });

      // Transformar los datos para incluir el nombre de la clase en el nivel superior y eliminar la redundancia
      const resultado = asistencias.map((asistencia) => {
        const asistenciaJSON = asistencia.toJSON();
        const { Clase, ...resto } = asistenciaJSON; // Extraer Clase y el resto de las propiedades
        return {
          ...resto,
          nombre_clase: Clase?.nombre_clase, // Agregar el nombre de la clase al nivel superior
        };
      });

      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
};

export default asistenciaController;