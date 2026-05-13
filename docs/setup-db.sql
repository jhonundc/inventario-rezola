-- Script para crear la tabla Productos en SQL Server
-- Ejecutar en SQL Server Management Studio

CREATE TABLE Productos (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(255),
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria NVARCHAR(50),
    fechaCreacion DATETIME DEFAULT GETDATE(),
    fechaActualizacion DATETIME DEFAULT GETDATE()
);

-- Insertar datos de ejemplo
INSERT INTO Productos (nombre, descripcion, precio, stock, categoria) VALUES
('Laptop Dell XPS', 'Laptop de alta gama con procesador Intel i7', 1200.00, 5, 'Electrónica'),
('Mouse Logitech', 'Mouse inalámbrico USB', 25.50, 20, 'Accesorios'),
('Teclado Mecánico', 'Teclado RGB para gaming', 89.99, 15, 'Accesorios'),
('Monitor LG 27"', 'Monitor 4K ultra HD', 450.00, 3, 'Electrónica'),
('Audífonos Sony', 'Audífonos con cancelación de ruido', 199.99, 10, 'Audio');

-- Verificar la tabla
SELECT * FROM Productos;
