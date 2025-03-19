import { Request, Response } from "express";
import { sequelize } from "../config/database"; // Asegúrate de importar tu instancia de Sequelize
import Clase from "../models/clase";
import ClaseDias from "../models/claseDias";

const claseController = {
  createClase: async (req: Request, res: Response) => {
    try {
      const { nombre_clase, horario, duracion, id_profesor, dias } = req.body;
  
      // Crear la clase
      const newClase = await Clase.create({ nombre_clase, horario, duracion, id_profesor });
  
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
      const { id } = req.params;
  
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