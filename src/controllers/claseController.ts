import { Request, Response } from "express";
import Clase from "../models/clase";

const claseController = {
  createClase: async (req: Request, res: Response) => {
    try {
      const newClase = await Clase.create(req.body);
      res.status(201).json(newClase);
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
      const deleted = await Clase.destroy({ where: { id_clase: req.params.id } });
      if (deleted) {
        res.status(200).json({ message: "Clase eliminada exitosamente" });
      } else {
        res.status(404).json({ message: "Clase no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  partialUpdateClase: async (req: Request, res: Response) => {
    try {
      const clase = await Clase.findByPk(req.params.id);
      if (!clase) {
        return res.status(404).json({ message: "Clase no encontrada" });
      }

      await Clase.update(req.body, { where: { id_clase: req.params.id } });
      const updatedClase = await Clase.findByPk(req.params.id);
      res.status(200).json(updatedClase);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getClasesByUsuarioId: async (req: Request, res: Response) => {
    try {
      const clases = await Clase.findAll({ where: { id_profesor: req.params.id } });
      res.status(200).json(clases);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
};

export default claseController;