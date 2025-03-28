import { Request, Response } from "express";
import Inscripcion from "../models/inscripcion";
import UsuarioModel from "../models/usuario";
import Clase from "../models/clase";
import ClaseDias from "../models/claseDias"; // Import the ClaseDias model
import jwt from "jsonwebtoken";

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
      const { id } = req.body; // Cambiado a req.body
      const inscripcion = await Inscripcion.findByPk(id);
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
      if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const userId = (req.user as jwt.JwtPayload).id; // ID del usuario autenticado extraído del token
      const { id } = req.params; // ID de la clase
  
      // Verificar si existe una inscripción para el usuario autenticado y la clase especificada
      const inscripcion = await Inscripcion.findOne({
        where: { id_estudiante: userId, id_clase: id },
      });
      if (!inscripcion) {
        return res.status(404).json({ message: "Inscripción no encontrada" });
      }
  
      // Eliminar la inscripción
      const deleted = await Inscripcion.destroy({
        where: { id_estudiante: userId, id_clase: id },
      });
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
    const { id_clase } = req.body; // Se recibe el id_clase en el body

    // Buscar las inscripciones de la clase y obtener los nombres y correos de los estudiantes junto con la información de la clase
    const inscripciones = await Inscripcion.findAll({
      where: { id_clase },
      include: [
        {
          model: UsuarioModel,
          attributes: ["id_usuario", "nombre", "email"], // Ahora también se incluye el correo
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

    // Extraer los nombres y correos de los estudiantes
    const alumnos = inscripciones.map((inscripcion) => {
      const usuario = inscripcion.get("Usuario");
      return {
        id_usuario: (usuario as any).id_usuario,
        nombre: (usuario as any).nombre,
        email: (usuario as any).email, // Se añade el correo
      };
    });

    res.status(200).json({
      clase,
      alumnos,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
},


  getClasesPorAlumno: async (req: Request, res: Response) => {
    try {
      const { id_estudiante } = req.body;
  
      // Buscar las inscripciones del estudiante y obtener la información de las clases
      const inscripciones = await Inscripcion.findAll({
        where: { id_estudiante },
        include: [
          {
            model: Clase,
            attributes: ["id_clase", "nombre_clase", "horario", "duracion", "codigo_clase"],
            include: [
              {
                model: ClaseDias,
                attributes: ["dia_semana"],
                as: "ClaseDias",
              },
              {
                model: UsuarioModel, // Incluir el profesor
                attributes: ["nombre"], // Solo obtener el nombre del profesor
                as: "Profesor",
              },
            ],
          },
        ],
      });
  
      if (inscripciones.length === 0) {
        return res.status(404).json({ message: "El estudiante no está inscrito en ninguna clase." });
      }
  
      // Extraer la información de las clases con la cantidad de alumnos y días
      const clases = await Promise.all(
        inscripciones.map(async (inscripcion) => {
          const clase = inscripcion.get("Clase") as any;
  
          // Contar la cantidad de alumnos inscritos en la clase
          const cantidadAlumnos = await Inscripcion.count({ where: { id_clase: clase.id_clase } });
  
          // Convertir el objeto Sequelize a JSON y eliminar ClaseDias
          const claseJSON = clase.toJSON();
          const dias = claseJSON.ClaseDias?.map((dia: any) => dia.dia_semana) || []; // Extraer los días de la clase
          delete claseJSON.ClaseDias; // Eliminar ClaseDias del objeto
  
          // Extraer el nombre del profesor
          const nombreProfesor = claseJSON.Profesor?.nombre || ""; // Obtener solo el nombre del profesor
          delete claseJSON.Profesor; // Eliminar la propiedad Profesor del objeto
  
          return {
            ...claseJSON,
            cantidadAlumnos,
            dias,
            nombreProfesor, // Renombrar la propiedad a nombreProfesor
          };
        })
      );
  
      res.status(200).json(clases);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
  
};

export default inscripcionController;