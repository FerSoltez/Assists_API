import { Request, Response } from "express";
import Inscripcion from "../models/inscripcion";
import Usuario from "../models/usuario";
import Clase from "../models/clase";

const inscripcionController = {
  createInscripcion: async (req: Request, res: Response) => {
    try {
      const { codigo_clase, id_estudiante } = req.body;

      // Verificar si el código de la clase es válido
      const clase = await Clase.findOne({ where: { codigo_clase } });

      if (!clase) {
        return res.status(404).json({ message: "Código de clase inválido. No se encontró la clase." });
      }

      // Verificar si el estudiante ya está inscrito en la clase
      const inscripcionExistente = await Inscripcion.findOne({
        where: { id_clase: clase.id_clase, id_estudiante },
      });

      if (inscripcionExistente) {
        return res.status(400).json({ message: "El estudiante ya está inscrito en esta clase." });
      }

      // Crear la inscripción
      const newInscripcion = await Inscripcion.create({
        id_clase: clase.id_clase,
        id_estudiante,
      });

      res.status(201).json({
        message: "Inscripción realizada exitosamente.",
        inscripcion: newInscripcion,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getAllInscripciones: async (req: Request, res: Response) => {
    try {
      const inscripciones = await Inscripcion.findAll();
      res.status(200).json(inscripciones);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getInscripcion: async (req: Request, res: Response) => {
    try {
      const inscripcion = await Inscripcion.findByPk(req.params.id);
      if (inscripcion) {
        res.status(200).json(inscripcion);
      } else {
        res.status(404).json({ message: "Inscripción no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  deleteInscripcion: async (req: Request, res: Response) => {
    try {
      const deleted = await Inscripcion.destroy({ where: { id_inscripcion: req.params.id } });
      if (deleted) {
        res.status(200).json({ message: "Inscripción eliminada exitosamente" });
      } else {
        res.status(404).json({ message: "Inscripción no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getAlumnosPorClase: async (req: Request, res: Response) => {
    try {
      const { id_clase } = req.params;

      // Buscar las inscripciones de la clase y obtener los nombres de los estudiantes junto con la información de la clase
      const inscripciones = await Inscripcion.findAll({
        where: { id_clase },
        include: [
          {
            model: Usuario,
            attributes: ["id_usuario", "nombre"], // Solo traer el ID y el nombre del estudiante
          },
          {
            model: Clase,
            attributes: ["id_clase", "nombre_clase", "horario", "duracion", "codigo_clase"], // Información de la clase
          },
        ],
      });

      if (inscripciones.length === 0) {
        return res.status(404).json({ message: "No hay alumnos inscritos en esta clase." });
      }

      // Extraer la información de la clase (es la misma para todas las inscripciones)
      const clase = inscripciones[0].get("Clase");

      // Extraer los nombres de los estudiantes
      const alumnos = inscripciones.map((inscripcion) => inscripcion.get("Usuario"));

      res.status(200).json({
        clase,
        alumnos,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
};

export default inscripcionController;