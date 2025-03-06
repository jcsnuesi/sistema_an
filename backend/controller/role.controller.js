import validator from "validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roleController = {
  // Create a new cargo
  create: async (req, res) => {
    try {
      const { role_descripcion, permiso } = req.body;

      // Validate inputs
      if (!role_descripcion || validator.isEmpty(role_descripcion.trim())) {
        return res
          .status(400)
          .json({ message: "El nombre del cargo es requerido" });
      }

      const newRole = await prisma.role.create({
        data: {
          role_name: role_descripcion,
          permisos: permiso,
        },
      });
      prisma.$disconnect();
      return res.status(201).json({
        message: "Role creado exitosamente",
        cargo: newRole,
      });
    } catch (error) {
      console.error("Error al crear cargo:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // Get all cargos
  getAll: async (req, res) => {
    try {
      const cargos = await prisma.cargo.findMany();
      return res.status(200).json(cargos);
    } catch (error) {
      console.error("Error al obtener cargos:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // Get cargo by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const cargo = await prisma.cargo.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!cargo) {
        return res.status(404).json({ message: "Cargo no encontrado" });
      }

      return res.status(200).json(cargo);
    } catch (error) {
      console.error("Error al obtener cargo:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // Update cargo
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;

      const updatedCargo = await prisma.cargo.update({
        where: {
          id: Number(id),
        },
        data: {
          ...(nombre && { nombre }),
          ...(descripcion !== undefined && { descripcion }),
        },
      });

      return res.status(200).json({
        message: "Cargo actualizado exitosamente",
        cargo: updatedCargo,
      });
    } catch (error) {
      console.error("Error al actualizar cargo:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // Delete cargo
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.cargo.delete({
        where: {
          id: Number(id),
        },
      });

      return res.status(200).json({
        message: "Cargo eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar cargo:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

export default roleController;
