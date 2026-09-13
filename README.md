# Arquitectura NoSQL para E-Commerce

Este repositorio contiene la implementación y validación de un modelo de base de datos orientado a documentos (MongoDB) diseñado para soportar la alta demanda y variabilidad de un catálogo de comercio electrónico.

<br>

## Estructura del Proyecto

- `/data`: Archivos JSON (`productos.json`, `clientes.json`, `transacciones.json`) con el esquema base de datos utilizando referencias lógicas para evitar el antipatrón de arreglos ilimitados.
- `/docs`: Diagrama Entidad-Documento (Mermaid) y documentación técnica del clúster (Teorema CAP, Sharding, Replica Sets).
- `/scripts`:
    - `seed.js`: Poblamiento asíncrono con inyección masiva de 100.000 registros para pruebas de carga.
    - `queries.js`: Consultas analíticas transaccionales resueltas mediante _Aggregation Pipeline_.
    - `stress_test.js`: Pruebas de concurrencia extrema (500 peticiones) y validación de métricas de rendimiento (`COLLSCAN` vs `IXSCAN`).

<br>

## Requisitos Previos

- [Node.js](https://nodejs.org/) (v16 o superior)
- [MongoDB](https://www.mongodb.com/) (Instancia local en puerto 27017 o cadena de conexión Atlas)

<br>

## Instalación y Configuración

1. Clonar el repositorio:

```bash
git clone https://github.com/cTapiaDev/ecommerce-nosql-integrador
cd ecommerce-nosql-integrador
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:
   Crear un archivo `.env` en la raíz del proyecto y definir la cadena de conexión:

```
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
```

<br>

## Ejecución de Pruebas

El sistema automatiza la inyección de datos y la evaluación de índices. Ejecutar los scripts en el siguiente orde estricto:

1. Poblamiento Masivo de Datos:

```bash
node scripts/seed.js
```

2. Prueba de Estrés y Validación de índices (Explain Plans):

```bash
node scripts/stress_test.js
```

3. Ejecución de Consultas Analíticas:

```bash
node scripts/queries.js
```

<br>

## Arquitectura y Escalabilidad

El diseño teórico de producción está proyectado para **MongoDB Atlas (Replica Set)**, implementado una consistencia híbrida basada en el Teorema CAP:

- **Consistencia Fuente (w: majority):** Para la transacciones financieras e integridad de inventario.
- **Consistencia Eventual (readPreference: secondaryPreferred):** Para la alta disponibilidad y baja latencia en la lectura del catálogo de productos.
