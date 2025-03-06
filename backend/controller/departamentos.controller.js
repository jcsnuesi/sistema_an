import validator from "validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const departamentoController = {
  // Create a new departamento
  create: async (req, res) => {
    try {
      const { departamento_nombre } = req.body;

      // Validate inputs
      if (
        !departamento_nombre ||
        validator.isEmpty(departamento_nombre.trim())
      ) {
        return res
          .status(400)
          .json({ message: "El nombre del departamento es requerido" });
      }

      const newdepartamento = await prisma.departamento.create({
        data: {
          departamento_nombre: departamento_nombre,
        },
      });

      prisma.$disconnect();
      return res.status(201).json({
        message: "departamento creado exitosamente",
        departamento: newdepartamento,
      });
    } catch (error) {
      console.error("Error al crear departamento:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // Get all departamentos
  getAll: async (req, res) => {
    try {
      const departamentos = await prisma.departamento.findMany();
      return res.status(200).json(departamentos);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // Get departamento by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const departamento = await prisma.departamento.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!departamento) {
        return res.status(404).json({ message: "departamento no encontrado" });
      }

      return res.status(200).json(departamento);
    } catch (error) {
      console.error("Error al obtener departamento:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // Update departamento
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;

      const updateddepartamento = await prisma.departamento.update({
        where: {
          id: Number(id),
        },
        data: {
          ...(nombre && { nombre }),
          ...(descripcion !== undefined && { descripcion }),
        },
      });

      return res.status(200).json({
        message: "departamento actualizado exitosamente",
        departamento: updateddepartamento,
      });
    } catch (error) {
      console.error("Error al actualizar departamento:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // Delete departamento
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.departamento.delete({
        where: {
          id: Number(id),
        },
      });

      return res.status(200).json({
        message: "departamento eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar departamento:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

export default departamentoController;
