const { MongoClient } = require('mongodb');
const { EJSON } = require('bson');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const generarProductosMasivos = (productosBase) => {
    const productosArray = [...productosBase];
    console.log('Generando 100.000 productos de prueba (esto puede tardar unos segundos)...');

    for (let i = 0; i < 100000; i++) {
        productosArray.push({
            sku: `TEST-PROD-${i}`,
            categoria: 'Muebles',
            nombre: `Producto de Relleno ${i}`,
            precio_centavos: 10000 + i,
            stock_disponible: 100,
        });
    }
    return productosArray;
};

const seedDatabase = async () => {
    try {
        await client.connect();
        const db = client.db();
        console.log('Conectado a MongoDB');

        const loadData = (fileName) => {
            const rawData = fs.readFileSync(path.join(__dirname, '../data', fileName), 'utf8');
            return EJSON.parse(rawData);
        };

        const productosBase = loadData('productos.json');
        const clientes = loadData('clientes.json');
        const transacciones = loadData('transacciones.json');

        await db.collection('productos').deleteMany({});
        await db.collection('clientes').deleteMany({});
        await db.collection('transacciones').deleteMany({});

        const productosPoblados = generarProductosMasivos(productosBase);

        console.log('Insertando datos en la base de datos...');
        await db.collection('productos').insertMany(productosPoblados);
        await db.collection('clientes').insertMany(clientes);
        await db.collection('transacciones').insertMany(transacciones);

        console.log('Datos insertados correctamente.');
    } catch (error) {
        console.error('Error en el poblado de datos:', error);
    } finally {
        await client.close();
    }
};

seedDatabase();
