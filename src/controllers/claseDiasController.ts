import { Request, Response } from "express";
import ClaseDias from "../models/claseDias";

const claseDiasController = {
  createClaseDia: async (req: Request, res: Response) => {
    try {
      const newClaseDia = await ClaseDias.create(req.body);
      res.status(201).json(newClaseDia);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getAllClaseDias: async (req: Request, res: Response) => {
    try {
      const claseDias = await ClaseDias.findAll();
      res.status(200).json(claseDias);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getClaseDia: async (req: Request, res: Response) => {
    try {
      const claseDia = await ClaseDias.findByPk(req.params.id);
      if (claseDia) {
        res.status(200).json(claseDia);
      } else {
        res.status(404).json({ message: "ClaseDia no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  updateClaseDia: async (req: Request, res: Response) => {
    try {
      const [updated] = await ClaseDias.update(req.body, { where: { id_clase_dia: req.params.id } });
      if (updated) {
        const updatedClaseDia = await ClaseDias.findByPk(req.params.id);
        res.status(200).json(updatedClaseDia);
      } else {
        res.status(404).json({ message: "ClaseDia no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  deleteClaseDia: async (req: Request, res: Response) => {
    try {
      const deleted = await ClaseDias.destroy({ where: { id_clase_dia: req.params.id } });
      if (deleted) {
        res.status(200).json({ message: "ClaseDia eliminada exitosamente" });
      } else {
        res.status(404).json({ message: "ClaseDia no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
};

export default claseDiasController;