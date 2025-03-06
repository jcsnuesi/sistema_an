import { Router } from "express";
import departamentoController from "../controller/departamentos.controller.js";

import { authenticated } from "../middleware/auth.js";

const router = Router();

// GET
// router.get("/create-cargo", aspirantesController.create);
// router.get("/get-aspirantes", aspirantesController.getAspirantes);
// router.get(
//   "/get-aspirantes-bygroup/:grupo/:genero_grupo?",
//   aspirantesController.getAspirantesByGroup
// );
// router.get(
//   "/get-aspirantes-byoccupation/:occupation/:genero?",
//   aspirantesController.getByOccupation
// );
// router.get("/get-avatar/:path/:avatar", getAvatar);
// router.get(
//   "/nuevas-solicitudes",
//   authenticated,
//   aspirantesController.nuevasSolicitudes
// );

// POST
router.post("/create-departamentos", departamentoController.create);

// // PUT
// router.put("/update-aspirante/:id", aspirantesController.update);
// router.put("/delete-aspirante/:id", aspirantesController.delete);
// router.put("/upt-avatar-aspirante/:path", [multipartMiddleware], updateAvatar);

export default router;
