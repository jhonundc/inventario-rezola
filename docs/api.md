# Documentación de la API

## Productos

### GET /api/productos
Retorna la lista de productos.

### POST /api/productos
Crea un nuevo producto.

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
