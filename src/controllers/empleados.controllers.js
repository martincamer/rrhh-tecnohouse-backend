import { pool } from "../db.js";
import { v4 as uuidv4 } from "uuid";

// Obtener todos los empleados
export const getEmpleados = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM empleados");

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No se encontraron empleados" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener un empleado por su ID
export const getEmpleadoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM empleados WHERE id = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró ningún empleado con ese ID" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener empleado por ID:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const crearEmpleado = async (req, res, next) => {
  const {
    apellido,
    ciudad,
    cuenta_bancaria,
    direccion,
    dni,
    email_empleado,
    estado_civil,
    fecha_contratacion,
    fecha_nacimiento,
    genero,
    nombre,
    numero_telefono,
    obrasocial,
    pais,
    puesto,
    telefono_personal,
    tipo_contrato,
    fabrica,
    estado,
  } = req.body;

  const { username, userRole, localidad, sucursal } = req;

  try {
    // Insertar el nuevo empleado
    const insertResult = await pool.query(
      "INSERT INTO empleados (nombre, apellido, ciudad, cuenta_bancaria, direccion, dni, email_empleado, estado_civil, fecha_contratacion, fecha_nacimiento, genero, numero_telefono, obrasocial, pais, puesto, telefono_personal, tipo_contrato, fabrica, estado, localidad, sucursal, usuario, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING *",
      [
        nombre,
        apellido,
        ciudad,
        cuenta_bancaria,
        direccion,
        dni,
        email_empleado,
        estado_civil,
        fecha_contratacion,
        fecha_nacimiento,
        genero,
        numero_telefono,
        obrasocial,
        pais,
        puesto,
        telefono_personal,
        tipo_contrato,
        fabrica,
        estado,
        localidad,
        sucursal,
        username,
        userRole,
      ]
    );

    // Obtener todos los empleados de la misma localidad y sucursal del usuario
    const selectResult = await pool.query(
      "SELECT * FROM empleados WHERE localidad = $1 AND sucursal = $2",
      [localidad, sucursal]
    );

    res.status(201).json({
      nuevoEmpleado: insertResult.rows[0],
      todosLosEmpleados: selectResult.rows,
    });
  } catch (error) {
    console.error("Error al crear empleado:", error);
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Ya existe un empleado con ese apellido",
      });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar información de un empleado
export const actualizarEmpleado = async (req, res) => {
  const { id } = req.params;
  const {
    apellido,
    ciudad,
    comprobantes,
    conyuge,
    created_at,
    cuenta_bancaria,
    direccion,
    dni,
    dni_conyuge,
    dni_madre,
    dni_padre,
    email_empleado,
    estado,
    estado_civil,
    estudios_primarios,
    estudios_secundarios,
    estudios_universitarios,
    fecha_contratacion,
    fecha_nacimiento,
    genero,
    hijos,
    localidad,
    madre,
    nombre,
    numero_conyuge,
    numero_telefono,
    obrasocial,
    padre,
    pais,
    puesto,
    role_id,
    salario_actual,
    sucursal,
    telefono_personal,
    tipo_contrato,
    usuario,
  } = req.body;

  try {
    const result = await pool.query(
      "UPDATE empleados SET apellido = $1, ciudad = $2, comprobantes = $3, conyuge = $4, created_at = $5, cuenta_bancaria = $6, direccion = $7, dni = $8, dni_conyuge = $9, dni_madre = $10, dni_padre = $11, email_empleado = $12, estado = $13, estado_civil = $14, estudios_primarios = $15, estudios_secundarios = $16, estudios_universitarios = $17, fecha_contratacion = $18, fecha_nacimiento = $19, genero = $20, hijos = $21, localidad = $22, madre = $23, nombre = $24, numero_conyuge = $25, numero_telefono = $26, obrasocial = $27, padre = $28, pais = $29, puesto = $30, role_id = $31, salario_actual = $32, sucursal = $33, telefono_personal = $34, tipo_contrato = $35, updated_at = CURRENT_TIMESTAMP, usuario = $36 WHERE id = $37 RETURNING *",
      [
        apellido,
        ciudad,
        comprobantes,
        conyuge,
        created_at,
        cuenta_bancaria,
        direccion,
        dni,
        dni_conyuge,
        dni_madre,
        dni_padre,
        email_empleado,
        estado,
        estado_civil,
        estudios_primarios,
        estudios_secundarios,
        estudios_universitarios,
        fecha_contratacion,
        fecha_nacimiento,
        genero,
        hijos,
        localidad,
        madre,
        nombre,
        numero_conyuge,
        numero_telefono,
        obrasocial,
        padre,
        pais,
        puesto,
        role_id,
        salario_actual,
        sucursal,
        telefono_personal,
        tipo_contrato,
        usuario,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "No se encontró ningún empleado con ese ID",
      });
    }

    // Obtener todos los empleados que coincidan con el usuario y localidad
    const allEmpleados = await pool.query(
      "SELECT * FROM empleados WHERE usuario = $1 AND localidad = $2",
      [usuario, localidad]
    );

    res.status(200).json({
      empleadoActualizado: result.rows[0],
      todosLosEmpleados: allEmpleados.rows,
    });
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar un empleado
export const eliminarEmpleado = async (req, res) => {
  const { id } = req.params;
  const { usuario, localidad } = req.body;

  try {
    const result = await pool.query("DELETE FROM empleados WHERE id = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "No se encontró ningún empleado con ese ID",
      });
    }

    // Obtener todos los empleados que coincidan con el usuario y localidad después de la eliminación
    const allEmpleados = await pool.query(
      "SELECT * FROM empleados WHERE usuario = $1 AND localidad = $2",
      [usuario, localidad]
    );

    res.status(200).json(allEmpleados.rows);
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
