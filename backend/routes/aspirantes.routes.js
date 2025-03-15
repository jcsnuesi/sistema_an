import { Router } from "express";
import aspirantesController from "../controller/aspirantes.controller.js";
import multiparty from "connect-multiparty";
import { updateAvatar, getAvatar } from "../service/avatarService.js";
import { authenticated } from "../middleware/auth.js";

const multipartMiddleware = multiparty({ uploadDir: "./upload/aspirantes" });

const router = Router();

// GET
router.get("/aspirantes", aspirantesController.testAspirantes);
router.get(
  "/get-aspirantes",
  authenticated,
  aspirantesController.getAspirantes
);
router.get(
  "/get-aspirantes-bygroup/:grupo/:genero_grupo?",
  aspirantesController.getAspirantesByGroup
);
router.get(
  "/get-aspirantes-byoccupation/:occupation/:genero?",
  aspirantesController.getByOccupation
);
router.get("/get-avatar/:path/:avatar", getAvatar);
router.get("/nuevas-solicitudes", aspirantesController.nuevasSolicitudes);
router.get(
  "/get-observaciones/:id",
  aspirantesController.getObsercacionesByAspirante
);
router.get("/consultar-solicitudes/:id", aspirantesController.getSolicited);
router.get(
  "/aspirantes-procesados",
  authenticated,
  aspirantesController.getAspirantesProcesados
);

// POST
router.post(
  "/create-aspirante",
  [multipartMiddleware],
  aspirantesController.create
);
router.post("/edicion-solicitada", aspirantesController.solicitarEdicion);
router.post("/login-consulta", aspirantesController.loginConsulta);

// PUT
router.put(
  "/update-aspirante/:id",
  [multipartMiddleware],
  aspirantesController.update
);
router.put("/delete-aspirante/:id", aspirantesController.delete);
router.put("/upt-avatar-aspirante/:path", [multipartMiddleware], updateAvatar);
router.put(
  "/update-estatus-solicitud/:id",
  authenticated,
  aspirantesController.updateEstatusSolicitud
);
router.put("/update-badge", authenticated, aspirantesController.updateBadge);
router.put(
  "/set-leidos-aspirantes",
  authenticated,
  aspirantesController.updateLeidos
);
// router.put(
//   "/update-solicitud-aspirante",
//   authenticated,
//   aspirantesController.updateSolicitud
// );

export default router;
