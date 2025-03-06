"use strict";
import jwt from "jwt-simple";
import moment from "moment";
const secret = "mi_clave_academia_2025";

export function createToken(user) {
  const payload = {
    id: user._id,
    correo_institucional: user.correo_institucional,
    nombres: user.nombres,
    apellidos: user.apellidos,
    role: user.role,
    iat: moment().unix(),
    exp: moment().add(1, "days").unix(),
  };

  return jwt.encode(payload, secret);
}
