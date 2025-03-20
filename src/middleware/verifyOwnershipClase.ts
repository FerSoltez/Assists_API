import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import Clase from "../models/clase";
import Inscripcion from "../models/inscripcion";

const verifyOwnershipClase = (req: Request, res: Response, next: NextFunction): void => {
  const userIdFromToken = (req.user as JwtPayload).id;
  const userTypeFromToken = (req.user as JwtPayload).id_tipo;
  const { id_clase } = req.params;

  if (userTypeFromToken === 1) {
    // Si es un profesor, verificar que sea el dueño de la clase
    Clase.findOne({ where: { id_clase, id_profesor: userIdFromToken } })
      .then((clase) => {
        if (!clase) {
          return res.status(403).json({ message: "Acceso denegado. No puedes acceder a esta clase." });
        }
        next();
      })
      .catch((error) => res.status(500).json({ error: (error as Error).message }));
  } else if (userTypeFromToken === 2) {
    // Si es un estudiante, verificar que esté inscrito en la clase
    Inscripcion.findOne({ where: { id_clase, id_estudiante: userIdFromToken } })
      .then((inscripcion) => {
        if (!inscripcion) {
          return res.status(403).json({ message: "Acceso denegado. No estás inscrito en esta clase." });
        }
        next();
      })
      .catch((error) => res.status(500).json({ error: (error as Error).message }));
  } else {
    res.status(403).json({ message: "Acceso denegado. Tipo de usuario no válido." });
  }
};

export default verifyOwnershipClase;