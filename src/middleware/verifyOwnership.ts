import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

const verifyOwnership = (req: Request, res: Response, next: NextFunction): void => {
  const userIdFromToken = (req.user as JwtPayload).id;

  if (Number(req.params.id) !== userIdFromToken) {
    res.status(403).json({ message: "Acceso denegado. No puedes acceder a este recurso." });
    return;
  }

  next();
};

export default verifyOwnership;