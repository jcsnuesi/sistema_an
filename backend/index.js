"use strict";

import express from "express";
import aspirantesRoutes from "./routes/aspirantes.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import cargoRoutes from "./routes/cargo.routes.js";
import departamentoRoutes from "./routes/departamentos.routes.js";
import tr from "./routes/role.routes.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api", aspirantesRoutes);
app.use("/api", staffRoutes);
app.use("/api", cargoRoutes);
app.use("/api", departamentoRoutes);
app.use("/api", tr);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
