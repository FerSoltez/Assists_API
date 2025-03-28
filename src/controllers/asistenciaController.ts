import { Request, Response } from "express";
import AsistenciaModel from "../models/asistencia";
import jwt from "jsonwebtoken";
import ClaseModel from "../models/clase"; // Import the ClaseModel

const asistenciaController = {
  createAsistencia: async (req: Request, res: Response) => {
    try {
      const { id_estudiante, id_clase, fecha_hora } = req.body;

      // Convertir la fecha a solo día para comparar
      const fechaInicioDelDia = new Date(fecha_hora);
      fechaInicioDelDia.setHours(0, 0, 0, 0);
      const fechaFinDelDia = new Date(fecha_hora);
      fechaFinDelDia.setHours(23, 59, 59, 999);

      // Verificar si ya existe una asistencia para el estudiante, clase y día
      const asistenciaExistente = await AsistenciaModel.findOne({
        where: {
          id_estudiante,
          id_clase,
          fecha_hora: {
            $between: [fechaInicioDelDia, fechaFinDelDia],
          },
        },
      });

      if (asistenciaExistente) {
        return res.status(400).json({
          error: "Ya existe una asistencia registrada para este estudiante en esta clase y día.",
        });
      }

      // Crear la nueva asistencia
      const newAsistencia = await AsistenciaModel.create(req.body);
      res.status(201).json(newAsistencia);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getAsistencia: async (req: Request, res: Response) => {
    try {
      const { id } = req.body; // Cambiado a req.body
      const asistencia = await AsistenciaModel.findByPk(id);
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
      const [updated] = await AsistenciaModel.update(req.body, { where: { id_asistencia: req.params.id } });
      if (updated) {
        const updatedAsistencia = await AsistenciaModel.findByPk(req.params.id);
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
      const asistencia = await AsistenciaModel.findOne({
        where: { id_estudiante: userId, id_clase: id },
      });
      if (!asistencia) {
        return res.status(404).json({ message: "Asistencia no encontrada" });
      }
  
      // Eliminar la asistencia
      const deleted = await AsistenciaModel.destroy({
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
      const asistencia = await AsistenciaModel.findByPk(id);
      if (!asistencia) {
        return res.status(404).json({ message: "Asistencia no encontrada" });
      }
      if (asistencia.id_estudiante !== userId) {
        return res.status(403).json({ message: "Acceso denegado. No puedes actualizar una asistencia que no te pertenece." });
      }
  
      await AsistenciaModel.update(req.body, { where: { id_asistencia: id } });
      const updatedAsistencia = await AsistenciaModel.findByPk(id);
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
      const asistencias = await AsistenciaModel.findAll({
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