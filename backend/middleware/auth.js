"use strict";
import jwt from "jwt-simple";
import moment from "moment";
const secret = "mi_clave_academia_2025";

export function authenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: "No tienes autorización" });
  }
  const token = req.headers.authorization.replace(/['"]+/g, "");
  try {
    var payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: "El token ha expirado" });
    }
  } catch (ex) {
    return res.status(404).send({ message: "Token no válido" });
  }
  req.user = payload;
  next();
}
