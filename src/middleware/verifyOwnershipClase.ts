import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import Clase from "../models/clase";

const verifyOwnershipClase = (req: Request, res: Response, next: NextFunction): void => {
  const userIdFromToken = (req.user as JwtPayload).id;
  const userTypeFromToken = (req.user as JwtPayload).id_tipo;
  const { id_clase } = req.params;

  // Verificar que el usuario sea un maestro (id_tipo = 1)
  if (userTypeFromToken !== 1) {
    res.status(403).json({ message: "Acceso denegado. Solo los maestros pueden acceder a este recurso." });
    return;
  }

  // Verificar que el maestro sea el dueño de la clase
  Clase.findOne({ where: { id_clase, id_profesor: userIdFromToken } })
    .then((clase) => {
      if (!clase) {
        return res.status(403).json({ message: "Acceso denegado. No puedes acceder a esta clase." });
      }
      next();
    })
    .catch((error) => res.status(500).json({ error: (error as Error).message }));
};

export default verifyOwnershipClase;