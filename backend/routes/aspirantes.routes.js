import { Router } from "express";
import aspirantesController from "../controller/aspirantes.controller.js";
import multiparty from "connect-multiparty";
import { updateAvatar, getAvatar } from "../service/avatarService.js";
import { authenticated } from "../middleware/auth.js";

const multipartMiddleware = multiparty({ uploadDir: "./upload/aspirantes" });

const router = Router();

// GET
router.get("/aspirantes", aspirantesController.testAspirantes);
router.get("/get-aspirantes", aspirantesController.getAspirantes);
router.get(
  "/get-aspirantes-bygroup/:grupo/:genero_grupo?",
  aspirantesController.getAspirantesByGroup
);
router.get(
  "/get-aspirantes-byoccupation/:occupation/:genero?",
  aspirantesController.getByOccupation
);
router.get("/get-avatar/:path/:avatar", getAvatar);
router.get(
  "/nuevas-solicitudes",
  authenticated,
  aspirantesController.nuevasSolicitudes
);

// POST
router.post(
  "/create-aspirante",
  [multipartMiddleware],
  aspirantesController.create
);

// PUT
router.put("/update-aspirante/:id", aspirantesController.update);
router.put("/delete-aspirante/:id", aspirantesController.delete);
router.put("/upt-avatar-aspirante/:path", [multipartMiddleware], updateAvatar);

export default router;
