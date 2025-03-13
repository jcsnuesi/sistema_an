import validator from "validator";
import { PrismaClient } from "@prisma/client";
import { validateExtensions } from "../service/validateExtension.service.js";
import bcrypt from "bcrypt";
import { createToken } from "../service/jwt.js";

const generatePassword = await import("generate-password");
const password = generatePassword.default.generate({
  length: 8, // Longitud de la contraseña
  numbers: true, // Incluir números
  symbols: true, // Incluir símbolos
  uppercase: true, // Incluir letras mayúsculas
  lowercase: true, // Incluir letras minúsculas
  excludeSimilarCharacters: true, // Excluir caracteres similares
});

let salt = 10;

const prisma = new PrismaClient();

var staffController = {
  create: async function (req, res) {
    let params = req.body;

    try {
      var validate_nombre = !validator.isEmpty(params.nombres);
      var validate_apellido = !validator.isEmpty(params.apellidos);
      var validate_email = validator.isEmail(params.correo_institucional);
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (validate_nombre && validate_apellido && validate_email) {
      try {
        let password = bcrypt.hashSync(params.password, salt);
        const staff = await prisma.staff.create({
          data: {
            nombres: params.nombres,
            apellidos: params.apellidos,
            correo_institucional: params.correo_institucional,
            password: password,
            departamento_id: parseInt(params.departamento_id),
            cargo_id: parseInt(params.cargo_id),
            role_id: parseInt(params.role_id),
          },
          include: {
            departamento: true,
            cargo: true,
            role: true,
          },
        });

        return res.status(200).send({
          status: "success",
          message: "Staff creado exitosamente",
          staff,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          status: "error",
          message: "Error al crear Staff",
        });
      }
    } else {
      return res.status(500).send({
        status: "error",
        message: "Los datos no son válidos",
      });
    }
  },
  login: async function (req, res) {
    let params = req.body;

    try {
      var validate_email = validator.isEmail(params.correo_institucional);
      var validate_password = !validator.isEmpty(params.password);
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (validate_email && validate_password) {
      try {
        const staff = await prisma.staff.findUnique({
          where: {
            correo_institucional: params.correo_institucional,
            estado: "Activo",
          },
          include: {
            departamento: true,
            cargo: true,
            role: {
              select: {
                role_name: true,
              },
            },
          },
        });

        if (!staff) {
          return res.status(404).send({
            status: "error",
            message: "El usuario no existe o esta inactivo",
          });
        }

        const validPassword = bcrypt.compareSync(
          params.password,
          staff.password
        );

        if (!validPassword) {
          return res.status(401).send({
            status: "error",
            message: "Contraseña incorrecta",
          });
        }

        if (params.token) {
          return res.status(200).send({
            status: "success",
            token: createToken(staff),
          });
        }

        staff.password = undefined;
        staff.id = undefined;
        staff.cargo_id = undefined;
        staff.role_id = undefined;
        staff.departamento_id = undefined;
        return res.status(200).send({
          status: "success",
          user: staff,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          status: "error",
          message: "Error al iniciar sesión",
        });
      }
    } else {
      return res.status(500).send({
        status: "error",
        message: "Los datos no son válidos",
      });
    }
  },
  getStaff: async function (req, res) {
    try {
      const staff = await prisma.staff.findMany({
        where: {
          estado: "activo",
        },
        include: {
          departamento: true,
          cargo: true,
          role: true,
        },
      });

      return res.status(200).send({
        status: "success",
        staff,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Error al obtener el personal",
      });
    }
  },
  getStaffById: async function (req, res) {
    let id = req.params.id;

    try {
      const staff = await prisma.staff.findUnique({
        where: {
          public_id: id,
          estado: "activo",
        },
        include: {
          departamento: true,
          cargo: true,
          role: true,
        },
      });

      if (!staff) {
        return res.status(404).send({
          status: "error",
          message: "El personal no existe",
        });
      }

      return res.status(200).send({
        status: "success",
        staff,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Error al obtener el personal",
      });
    }
  },
  updateStaff: async function (req, res) {
    let id = req.params.id;
    let params = req.body;

    try {
      var validate_nombre = !validator.isEmpty(params.nombres);
      var validate_apellido = !validator.isEmpty(params.apellidos);
      var validate_email = validator.isEmail(params.correo_institucional);
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (validate_nombre && validate_apellido && validate_email) {
      try {
        const staff = await prisma.staff.update({
          where: {
            public_id: id,
          },
          data: {
            nombres: params.nombres,
            apellidos: params.apellidos,
            correo_institucional: params.correo_institucional,
            departamento_id: parseInt(params.departamento_id),
            cargo_id: parseInt(params.cargo_id),
            role_id: parseInt(params.role_id),
            estado: params.estado,
          },
          include: {
            departamento: true,
            cargo: true,
            role: true,
          },
        });

        return res.status(200).send({
          status: "success",
          message: "Personal actualizado",
          staff,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          status: "error",
          message: "Error al actualizar el personal",
        });
      }
    } else {
      return res.status(500).send({
        status: "error",
        message: "Los datos no son válidos",
      });
    }
  },
  deleteStaff: async function (req, res) {
    let id = req.params.id;

    try {
      await prisma.staff.update({
        where: {
          public_id: id,
        },
        data: {
          estado: "inactivo",
        },
      });

      return res.status(200).send({
        status: "success",
        message: "Personal eliminado",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Error al eliminar el personal",
      });
    }
  },
};

export default staffController;
