# Documentación de la API - Sistema de Inventario

## Autenticación
Todos los endpoints (excepto /api/auth) requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

## Base de Datos
El sistema utiliza las siguientes tablas de SQL Server:
- **InventarioHardware**: Almacena equipos (laptops, desktops, monitores, etc.)
- **InventarioSoftware**: Almacena software instalado
- **AsignacionesEquipo**: Historial de asignaciones (opcional para tu lógica)
- **Usuarios**: Para autenticación
- **Roles**: Gestión de permisos

## Productos

### GET /api/productos
Retorna la lista de productos.

### POST /api/productos
Crea un nuevo producto. **Requiere rol Admin**

Cuerpo de ejemplo:
```json
{
  "nombre": "Producto A",
  "descripcion": "Descripción del producto",
  "precio": 100,
  "stock": 20,
  "categoria": "Categoría X"
}
```

## Equipos Hardware

### GET /api/equipos/hardware
Retorna la lista de todos los equipos. **Requiere autenticación**

Respuesta de ejemplo:
```json
[
  {
    "id": 1,
    "numeroSerie": "SN12345",
    "tipo": "Laptop",
    "marca": "Dell",
    "modelo": "XPS 15",
    "especificaciones": "Intel i7, 16GB RAM, 512GB SSD",
    "estado": "Disponible",
    "usuarioAsignadoId": null,
    "fechaAdquisicion": "2024-01-15",
    "fechaVencimientoGarantia": "2026-01-15",
    "valor": 1200.00,
    "ubicacion": "Oficina Principal",
    "observaciones": "Nuevo",
    "fechaCreacion": "2024-01-15T10:00:00.000Z",
    "fechaActualizacion": "2024-01-15T10:00:00.000Z"
  }
]
```

### GET /api/equipos/hardware/:id
Retorna un equipo específico por ID. **Requiere autenticación**

### POST /api/equipos/hardware
Crea un nuevo equipo. **Requiere rol Admin**

Cuerpo de ejemplo (campos requeridos marcados con *):
```json
{
  "numeroSerie": "SN12345",        // * Único
  "tipo": "Laptop",               // * (Laptop, Desktop, Monitor, Impresora, Servidor, Switch, Router, Otro)
  "marca": "Dell",                // *
  "modelo": "XPS 15",             // *
  "especificaciones": "Intel i7, 16GB RAM, 512GB SSD",
  "estado": "Disponible",         // Disponible, Asignado, Mantenimiento, Obsoleto
  "usuarioAsignadoId": null,      // ID del usuario asignado (si aplica)
  "fechaAdquisicion": "2024-01-15",
  "fechaVencimientoGarantia": "2026-01-15",
  "valor": 1200.00,
  "ubicacion": "Oficina Principal",
  "observaciones": "Nuevo"
}
```

### PUT /api/equipos/hardware/:id
Actualiza un equipo existente. **Requiere rol Admin**

Cuerpo: Puedes actualizar uno o más campos del equipo.

### DELETE /api/equipos/hardware/:id
Elimina un equipo y todo el software asociado. **Requiere rol Admin**

---

## Software

### GET /api/equipos/software
Retorna la lista de todo el software. **Requiere autenticación**

Respuesta de ejemplo:
```json
[
  {
    "id": 1,
    "nombre": "Windows 11 Pro",
    "tipo": "Sistema Operativo",
    "version": "23H2",
    "licencia": "Perpetua",
    "clave": "XXXXX-XXXXX-XXXXX",
    "estado": "Activo",
    "fechaExpiracion": null,
    "hardwareId": 1,
    "costoLicencia": 199.99,
    "descripcion": "Sistema operativo principal",
    "proveedor": "Microsoft",
    "fechaCreacion": "2024-01-15T10:00:00.000Z",
    "fechaActualizacion": "2024-01-15T10:00:00.000Z"
  }
]
```

### POST /api/equipos/software
Crea un nuevo registro de software. **Requiere rol Admin**

Cuerpo de ejemplo (campos requeridos marcados con *):
```json
{
  "nombre": "Windows 11 Pro",      // *
  "tipo": "Sistema Operativo",     // * (Sistema Operativo, Aplicación, Utilidad, Antivirus, Otra)
  "version": "23H2",               // *
  "licencia": "Perpetua",          // (Perpetua, Anual, Mensual, Trial)
  "clave": "XXXXX-XXXXX-XXXXX",
  "estado": "Activo",              // Activo, Inactivo, Expirado
  "fechaExpiracion": null,
  "hardwareId": 1,                 // ID del equipo al que está instalado
  "costoLicencia": 199.99,
  "descripcion": "Sistema operativo principal",
  "proveedor": "Microsoft"
}
```

---

## Estados de Equipos

- **Disponible**: Equipo disponible para asignar
- **Asignado**: Equipo asignado a un usuario
- **Mantenimiento**: Equipo en reparación o revisión
- **Obsoleto**: Equipo fuera de servicio

## Estados de Software

- **Activo**: Software en uso
- **Inactivo**: Software no utilizado
- **Expirado**: Licencia vencida

---

## Códigos de Respuesta HTTP

- **200**: Éxito
- **201**: Creado exitosamente
- **400**: Error en validación (campos requeridos, datos inválidos)
- **401**: No autorizado (token inválido o faltante)
- **403**: Acceso denegado (requiere rol Admin)
- **404**: Recurso no encontrado
- **500**: Error del servidor

---

## Panel de Administración

Accede al panel de admin en: `/equipo-admin.html`

**Requisitos:**
- Estar autenticado
- Tener rol de Administrador (rolId = 1)

**Funcionalidades:**
- ✅ Ver todos los equipos
- ✅ Agregar nuevos equipos
- ✅ Editar equipos existentes
- ✅ Eliminar equipos
- ✅ Ver software instalado
- ✅ Agregar software
- ✅ Ver estadísticas de inventario
