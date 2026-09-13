const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const runStressTest = async () => {
    try {
        await client.connect();
        const db = client.db();
        console.log('Iniciando pruebas de rendimiento y validación...');

        console.log('\n--- Ejecutando Prueba de Carga (500 peticiones simultáneas) ---');
        const startTime = Date.now();

        const promises = Array.from({ length: 500 }).map(() =>
            db.collection('productos').find({ categoria: 'Electronica' }).toArray(),
        );

        await Promise.all(promises);
        const endTime = Date.now();
        console.log(
            `Tiempo total para resolver 500 consultas concurrentes: ${endTime - startTime} ms`,
        );

        console.log('\n--- Plan de Ejecución SIN Índice ---');
        try {
            await db.collection('productos').dropIndex('categoria_1');
        } catch (e) {}

        let explainPlan = await db
            .collection('productos')
            .find({ categoria: 'Electronica' })
            .explain('executionStats');

        console.log(
            `Estrategia empleada: ${explainPlan.queryPlanner.winningPlan.stage} (Escaneo completo)`,
        );
        console.log(`Documentos examinados: ${explainPlan.executionStats.totalDocsExamined}`);
        console.log(
            `Tiempo de ejecución de la consulta: ${explainPlan.executionStats.executionTimeMillis} ms`,
        );

        console.log('\n--- Aplicando Optimización: Creando Índice en "categoria" ---');
        await db.collection('productos').createIndex({ categoria: 1 });

        console.log('\n--- Plan de Ejecución CON Índice ---');
        explainPlan = await db
            .collection('productos')
            .find({ categoria: 'Electronica' })
            .explain('executionStats');

        console.log(
            `Estrategia empleada: ${explainPlan.queryPlanner.winningPlan.stage} (Escaneo de Índice)`,
        );
        console.log(`Documentos examinados: ${explainPlan.executionStats.totalDocsExamined}`);
        console.log(
            `Tiempo de ejecución de la consulta: ${explainPlan.executionStats.executionTimeMillis} ms`,
        );
    } catch (error) {
        console.error('Error en las pruebas de estrés:', error);
    } finally {
        await client.close();
    }
};

runStressTest();
