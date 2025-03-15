import { Request, Response } from "express";
import Asistencia from "../models/asistencia";

const asistenciaController = {
  createAsistencia: async (req: Request, res: Response) => {
    try {
      const newAsistencia = await Asistencia.create(req.body);
      res.status(201).json(newAsistencia);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getAllAsistencias: async (req: Request, res: Response) => {
    try {
      const asistencias = await Asistencia.findAll();
      res.status(200).json(asistencias);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getAsistencia: async (req: Request, res: Response) => {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id);
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
      const deleted = await Asistencia.destroy({ where: { id_asistencia: req.params.id } });
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
      const asistencia = await Asistencia.findByPk(req.params.id);
      if (!asistencia) {
        return res.status(404).json({ message: "Asistencia no encontrada" });
      }

      await Asistencia.update(req.body, { where: { id_asistencia: req.params.id } });
      const updatedAsistencia = await Asistencia.findByPk(req.params.id);
      res.status(200).json(updatedAsistencia);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getAsistenciasByUsuarioId: async (req: Request, res: Response) => {
    try {
      const asistencias = await Asistencia.findAll({ where: { id_estudiante: req.params.id } });
      res.status(200).json(asistencias);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
};

export default asistenciaController;