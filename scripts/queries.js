const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const runQueries = async () => {
    try {
        await client.connect();
        const db = client.db();

        const getTopSellingProducts = async () => {
            console.log('\n--- Productos Más Vendidos ---');
            const pipeline = [
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.producto_id',
                        total_vendido: { $sum: '$items.cantidad' },
                    },
                },
                { $sort: { total_vendido: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'productos',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'producto_info',
                    },
                },
                { $unwind: '$producto_info' },
                {
                    $project: {
                        _id: 0,
                        nombre: '$producto_info.nombre',
                        total_vendido: 1,
                    },
                },
            ];

            const resultados = await db.collection('transacciones').aggregate(pipeline).toArray();
            console.table(resultados);
        };

        const getDiscountedProducts = async () => {
            console.log('\n--- Productos en Oferta ---');
            const resultados = await db
                .collection('productos')
                .find({ en_oferta: true })
                .project({ _id: 0, nombre: 1, precio_centavos: 1 })
                .toArray();

            console.table(resultados);
        };

        const getProductsByCategory = async (categoria) => {
            console.log(`\n--- Productos de la categoría: ${categoria} ---`);
            const resultados = await db
                .collection('productos')
                .find({ categoria })
                .project({ _id: 0, nombre: 1, stock_disponible: 1 })
                .toArray();

            console.table(resultados);
        };

        await getTopSellingProducts();
        await getDiscountedProducts();
        await getProductsByCategory('Electronica');
    } catch (error) {
        console.error('Error ejecutando las consultas:', error);
    } finally {
        await client.close();
    }
};

runQueries();
