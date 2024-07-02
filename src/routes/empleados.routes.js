import Router from "express-promise-router";
import { isAuth } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/salidas.middleware.js";
import {
  actualizarEmpleado,
  // crearComprobanteEmpleado,
  crearEmpleado,
  // eliminarComprobanteEmpleado,
  eliminarEmpleado,
  getEmpleadoById,
  getEmpleados,
} from "../controllers/empleados.controllers.js";

const router = Router();

router.get("/empleados", isAuth, isAdmin, getEmpleados);

router.get("/empleados/:id", isAuth, isAdmin, getEmpleadoById);

router.post("/empleados", isAuth, isAdmin, crearEmpleado);

router.put("/empleados/:id", isAuth, isAdmin, actualizarEmpleado);

router.delete("/empleados/:id", isAuth, isAdmin, eliminarEmpleado);

// router.post(
//   "/empleados/:id/comprobantes",
//   isAuth,
//   isAdmin,
//   crearComprobanteEmpleado
// );

// router.delete(
//   "/empleados/:id/comprobantes/:comprobanteId",
//   isAuth,
//   isAdmin,
//   eliminarComprobanteEmpleado
// );

export default router;
