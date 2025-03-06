import fs from "fs";
import path from "path";
import { validateExtensions } from "../service/validateExtension.service.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function updateAvatar(req, res) {
  let avatarName = validateExtensions(req);
  let paths = req.params.path;
  let aspiranteId = req.body.id;

  try {
    if (fs.existsSync(`upload/${paths}/${avatarName}`)) {
      await prisma.aspirantes.update({
        where: { id: parseInt(aspiranteId) },
        data: { foto: avatarName },
      });

      return res
        .status(200)
        .sendFile(path.resolve(`upload/${paths}/${avatarName}`));
    } else {
      return res.status(404).send({
        status: "error",
        message: "La imagen no existe",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al actualizar la foto del aspirante",
    });
  }
}

export async function getAvatar(req, res) {
  let avatarName = req.params.avatar;
  let paths = req.params.path;
  if (fs.existsSync(`upload/${paths}/${avatarName}`)) {
    return res
      .status(200)
      .sendFile(path.resolve(`upload/${paths}/${avatarName}`));
  } else {
    return res.status(404).send({
      status: "error",
      message: "La imagen no existe",
    });
  }
}
