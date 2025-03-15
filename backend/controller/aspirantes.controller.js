import validator from "validator";
import { PrismaClient } from "@prisma/client";
import { generarCodigoSistema } from "../service/generarCodigo.js";
import { validateExtensions } from "../service/validateExtension.service.js";
import { createTokenForLoginConsulta } from "../service/jwt.js";

const generatePassword = await import("generate-password");
const password = generatePassword.default.generate({
  length: 8, // Longitud de la contraseña
  numbers: true, // Incluir números
  symbols: true, // Incluir símbolos
  uppercase: true, // Incluir letras mayúsculas
  lowercase: true, // Incluir letras minúsculas
  excludeSimilarCharacters: true, // Excluir caracteres similares
});

const prisma = new PrismaClient();

var aspirantesController = {
  testAspirantes: async (req, res) => {
    return res.status(203).send({
      status: "success",
      message:
        "Ya existe una solicitud con esta cédula, favor contactarse con la institución",
    });
  },
  create: async function (req, res) {
    let params = req.body;
    let cedula = params.cedula.trim();

    try {
      var validate_cedula =
        !validator.isEmpty(params.cedula) && cedula.length === 13;
      var validate_email = validator.isEmail(params.email);
    } catch (err) {
      return res.status(500).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (validate_cedula && validate_email) {
      var fact_data = await generarCodigoSistema(params.genero, prisma);

      try {
        params.foto = validateExtensions(req);
        const aspirante = await prisma.aspirantes.create({
          data: {
            nombres: params.nombres,
            apellidos: params.apellidos,
            f_nacimiento: params.f_nacimiento,
            lugar_nacimiento: params.lugar_nacimiento,
            nacionalidad: params.nacionalidad,
            estado_civil: params.estado_civil,
            cedula: params.cedula,
            clave_temporal: password,
            dir_calle: params.dir_calle,
            dir_sector: params.dir_sector,
            dir_provincia: params.dir_provincia,
            dir_municipio: params.dir_municipio,
            celular: params.celular,
            email: params.email,
            ocupacion: params.ocupacion,
            genero: params.genero,
            escuela: params.escuela,
            sector_educativo: params.sector_educativo,
            programa_al_que_aspira: params.programa_al_que_aspira,
            nombre_madre: params.nombre_madre,
            apellido_madre: params.apellido_madre,
            telefono_madre: params.telefono_madre,
            nombre_padre: params.nombre_padre,
            apellido_padre: params.apellido_padre,
            telefono_padre: params.telefono_padre,
            foto: params.foto,
            anioAplicacion: new Date().getFullYear().toString(),
            alergico: params.alergico,
            discapacidad: params.discapacidad,
            discapacidad_detalle: params.discapacidad_detalle,
            institucion_militar: params.institucion_militar,
            rango: params.rango,
            fecha_ingreso: params.fecha_ingreso,
            fecha_ultimo_ascenso: params.fecha_ultimo_ascenso,
            fact_aspirantes: {
              create: {
                codigo_sistema: fact_data["codigo_sistema"],
                grupo: fact_data["grupo"],
                genero_grupo: fact_data["genero_grupo"],
              },
            },
          },
          include: {
            fact_aspirantes: true,
          },
        });

        await prisma.$disconnect();
        return res.status(200).send({
          status: "success",
          message: aspirante,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          message: "Error al guardar el aspirante",
        });
      }
    } else {
      return res.status(500).send({
        status: "error",
        message:
          "Faltan datos por enviar. Verifique que su email o cedula no hayan sido registrados",
      });
    }
  },
  update: async function (req, res) {
    `Posibles escenarios:
    1. Actualizar datos del aspirante
    2. Cambiar grupo
    3. Cambiar grupo y actualizar datos del aspirante
    4. Actualizar codigo_sistema si se cambia el grupo
    5. Actualizar codigo_sistema si se cambia el grupo y se actualizan los datos del aspirante`;

    // Parametros con el Id del aspirante
    let paramId = req.params.id;
    // Datos de entrada
    let params = req.body;
    // Validar si se va a cambiar el grupo
    params.cambiarGrupo = params.cambiarGrupo ? params.cambiarGrupo : null;
    let { cambiarGrupo, ...datos } = params;

    try {
      await prisma.aspirantes.update({
        where: { cedula: paramId },
        data: { ...datos },
      });

      if (params.cambiarGrupo !== null) {
        await prisma.fact_aspirantes.update({
          where: {
            id_aspirantes: parseInt(paramId),
          },
          data: {
            codigo_sistema: params.cambiarGrupo.codigo_sistema,
            grupo: parseInt(params.cambiarGrupo.grupo),
            genero_grupo: params.cambiarGrupo.genero_grupo,
            estatus_aspirante: params.cambiarGrupo.estatus_aspirante,
          },
        });
      }
      await prisma.$disconnect();
      return res.status(200).send({
        status: "success",
        message: "Aspirante actualizado",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el aspirante",
      });
    }
  },
  updateEstatusSolicitud: async function (req, res) {
    let paramId = req.params.id;
    let params = req.body;

    try {
      await prisma.fact_aspirantes.update({
        where: { id_aspirantes: parseInt(paramId) },
        data: {
          estatus_solicitud: params.estatus_solicitud,
        },
      });

      await prisma.$disconnect();
      return res.status(200).send({
        status: "success",
        message: "Solicitud actualizada",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar la solicitud",
      });
    }
  },
  updateBadge: async function (req, res) {
    let paramId = req.body;

    try {
      const datos = await prisma.observacion.updateMany({
        where: {
          id_aspirantes: parseInt(paramId.aspiranteId),
        },
        data: {
          atentido: Boolean(paramId.atentido == 1),
        },
      });

      await prisma.$disconnect();
      return res.status(200).send({
        status: "success",
        message: datos,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el Badge",
      });
    }
  },
  updateLeidos: async function (req, res) {
    let param = req.body;
    let ids = param.map((id) => parseInt(id.id));

    try {
      await prisma.fact_aspirantes.updateMany({
        where: {
          id_aspirantes: {
            in: ids,
          },
        },
        data: {
          leidos: true,
        },
      });

      await prisma.$disconnect();
      return res.status(200).send({
        status: "success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el updateLeidos",
      });
    }
  },
  delete: async function (req, res) {
    let paramId = req.params.id;

    try {
      await prisma.fact_aspirantes.update({
        where: { id_aspirantes: parseInt(paramId) },
        data: {
          estatus_aspirante: "Inactivo",
        },
      });

      await prisma.$disconnect();
      return res.status(200).send({
        status: "success",
        message: "Aspirante eliminado",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al eliminar el aspirante",
      });
    }
  },
  getAspirantes: async function (req, res) {
    try {
      const aspirantes = await prisma.aspirantes.findMany({
        include: {
          fact_aspirantes: true,
        },
      });

      await prisma.$disconnect();
      return res.status(200).send({
        status: "success",
        message: aspirantes,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al obtener los aspirantes",
      });
    }
  },
  getAspirantesByGroup: async function (req, res) {
    let grupoIdentifier = req.params.grupo;
    let generoGrupo = req.params.genero_grupo ?? null;
    let query = generoGrupo
      ? { grupo: parseInt(grupoIdentifier), genero_grupo: generoGrupo }
      : { grupo: parseInt(grupoIdentifier) };

    try {
      const grupoAspirantes = await prisma.fact_aspirantes.findMany({
        where: query,
        include: {
          aspirantes: true,
        },
      });

      await prisma.$disconnect();
      return res.status(200).send({
        status: "success",
        message: grupoAspirantes,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al obtener los aspirantes por grupo",
      });
    }
  },
  getByOccupation: async function (req, res) {
    let occupation = req.params.occupation;
    let generoParam = req.params.genero ?? null;
    let query = generoParam
      ? { ocupacion: occupation, genero: generoParam }
      : { ocupacion: occupation };
    try {
      const aspirantes = await prisma.aspirantes.findMany({
        where: query,
        include: {
          fact_aspirantes: true,
        },
      });
      await prisma.$disconnect();
      return res.status(200).send({
        status: "success",
        message: aspirantes,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Error al obtener los aspirantes por ocupación",
      });
    }
  },
  nuevasSolicitudes: async function (req, res) {
    try {
      const aspirante = await prisma.aspirantes.findMany({
        where: {
          fact_aspirantes: {
            some: {
              OR: [
                { estatus_solicitud: "En Proceso" },
                { estatus_solicitud: "Requiere Edición" },
              ],
            },
          },
        },
        include: {
          fact_aspirantes: true,
        },
      });
      await prisma.$disconnect();
      return res.status(200).send({
        status: "success",
        message: aspirante,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar la foto del aspirante",
      });
    }
  },
  solicitarEdicion: async function (req, res) {
    let param = req.body;

    try {
      var val_observation = !validator.isEmpty(param.observaciones);
      var val_id = !validator.isEmpty(param.id.toString());
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (val_observation && val_id) {
      try {
        await prisma.observacion.create({
          data: {
            observacion: param.observaciones,
            id_aspirantes: parseInt(param.id),
            staff_id: param.staff_id,
          },
        });
        await prisma.fact_aspirantes.update({
          where: { id_aspirantes: parseInt(param.id) },
          data: {
            estatus_solicitud: "Requiere Edición",
          },
        });

        await prisma.$disconnect();
        return res.status(200).send({
          status: "success",
          message: "Solicitud de edición enviada",
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          status: "error",
          message: "Error al enviar la solicitud de edición",
        });
      }
    } else {
      return res.status(500).send({
        status: "error",
        message: "Faltan datos por enviar ELSE",
      });
    }
  },

  getObsercacionesByAspirante: async function (req, res) {
    let paramId = req.params.id;
    try {
      const observaciones = await prisma.observacion.findMany({
        where: {
          id_aspirantes: parseInt(paramId),
        },
      });
      await prisma.$disconnect();
      return res.status(200).send({
        status: "success",
        message: observaciones,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al obtener las observaciones",
      });
    }
  },
  getSolicited: async function (req, res) {
    let paramId = req.params.id;

    try {
      const aspirante = await prisma.aspirantes.findUnique({
        where: {
          cedula: paramId,
        },
        include: {
          fact_aspirantes: true,
        },
      });

      await prisma.$disconnect();
      return res.status(200).send({
        status: "success",
        message: aspirante,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al obtener la solicitud",
      });
    }
  },
  getAspirantesProcesados: async function (req, res) {
    try {
      const aspirante = await prisma.aspirantes.findMany({
        where: {
          fact_aspirantes: {
            some: {
              estatus_solicitud: "Procesada",
            },
          },
        },
        include: {
          fact_aspirantes: true,
        },
      });

      await prisma.$disconnect();
      return res.status(200).send({
        status: "success",
        message: aspirante,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al obtener aspirantes procesados",
      });
    }
  },
  loginConsulta: async function (req, res) {
    let param = req.body;

    try {
      const aspirante = await prisma.aspirantes.findFirst({
        where: {
          AND: [{ cedula: param.cedula }, { clave_temporal: param.password }],
        },
        include: {
          fact_aspirantes: true,
        },
      });

      if (aspirante) {
        if (param.token) {
          const token = createTokenForLoginConsulta(aspirante);

          return res.status(200).send({
            status: "success",
            token: token,
          });
        }
        await prisma.$disconnect();
        return res.status(200).send({
          status: "success",
          message: aspirante,
        });
      } else {
        await prisma.$disconnect();
        return res.status(404).send({
          status: "error",
          message: "Cédula o contraseña incorrecta",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Error al obtener la solicitud",
      });
    }
  },
};

export default aspirantesController;
