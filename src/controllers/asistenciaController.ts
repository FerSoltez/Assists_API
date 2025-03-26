import { Request, Response } from "express";
import Asistencia from "../models/asistencia";
import jwt from "jsonwebtoken";
import ClaseModel from "../models/clase"; // Import the ClaseModel
import UsuarioModel from "../models/usuario"; // Asegúrate de importar el modelo Usuario

const asistenciaController = {
  createAsistencia: async (req: Request, res: Response) => {
    try {
      const newAsistencia = await Asistencia.create(req.body);
      res.status(201).json(newAsistencia);
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
      const { id } = req.params;
  
      // Verificar si la asistencia pertenece al usuario autenticado
      const asistencia = await Asistencia.findByPk(id);
      if (!asistencia) {
        return res.status(404).json({ message: "Asistencia no encontrada" });
      }
      if (asistencia.id_estudiante !== userId) {
        return res.status(403).json({ message: "Acceso denegado. No puedes eliminar una asistencia que no te pertenece." });
      }
  
      const deleted = await Asistencia.destroy({ where: { id_asistencia: id } });
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
      const userId = (req.user as jwt.JwtPayload).id;
      const { id } = req.body;
  
      if (parseInt(id) !== userId) {
        return res.status(403).json({ message: "Acceso denegado. No puedes ver las asistencias de otro usuario." });
      }
  
      // Obtener asistencias con el nombre de la clase y el nombre del profesor
      const asistencias = await Asistencia.findAll({
        where: { id_estudiante: id },
        include: [
          {
            model: ClaseModel,
            as: "Clase",
            attributes: ["nombre_clase"],
            include: [
              {
                model: UsuarioModel, // Relación con UsuarioModel (Profesor)
                as: "Profesor",
                attributes: ["nombre"], // Solo el nombre del profesor
              },
            ],
          },
        ],
      });
  
      // Transformar la respuesta para simplificar el formato
      interface AsistenciaResponse {
        id_asistencia: number;
        id_estudiante: number;
        fecha: string;
        nombre_clase?: string;
        nombre_profesor?: string;
      }

      interface ClaseResponse {
        nombre_clase?: string;
        Profesor?: {
          nombre?: string;
        };
      }

      interface AsistenciaJSON {
        id_asistencia: number;
        id_estudiante: number;
        fecha: string;
        Clase?: ClaseResponse;
      }

      const resultado: AsistenciaResponse[] = asistencias.map((asistencia) => {
        const asistenciaJSON = asistencia.toJSON() as unknown as AsistenciaJSON;
        const { Clase, ...resto } = asistenciaJSON;
        return {
          ...resto,
          nombre_clase: Clase?.nombre_clase,
          nombre_profesor: Clase?.Profesor?.nombre, // Agregar el nombre del profesor
        };
      });
  
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }  
};

export default asistenciaController;