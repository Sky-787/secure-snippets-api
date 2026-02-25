require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

const BASE_URL = 'http://localhost:3000/api/v1';

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runQA() {
    console.log("🔥 Iniciando Prueba de Fuego (QA) 🔥\n");

    let tokenA, tokenB, snippetId;

    try {
        // 0. Limpiar DB de pruebas anteriores usando la conexión directa
        console.log("🧹 Limpiando base de datos...");
        await mongoose.connect(process.env.MONGO_URI);
        await mongoose.connection.db.dropDatabase();
        console.log("✅ Base de datos limpia.\n");

        // 1. Registro: Crear dos usuarios (User A y User B)
        console.log("1️⃣  Registrando User A...");
        const resA = await axios.post(`${BASE_URL}/auth/register`, {
            username: "usera_test",
            email: "usera@test.com",
            password: "password123"
        });
        tokenA = resA.data.token;
        console.log(`✅ User A registrado exitosamente (Token obtenido).`);

        console.log("1️⃣  Registrando User B...");
        const resB = await axios.post(`${BASE_URL}/auth/register`, {
            username: "userb_test",
            email: "userb@test.com",
            password: "password123"
        });
        tokenB = resB.data.token;
        console.log(`✅ User B registrado exitosamente (Token obtenido).\n`);

        // 2. Creación: Crear un snippet con el Token del User A.
        console.log("2️⃣  User A está creando un Snippet...");
        const resSnippet = await axios.post(`${BASE_URL}/snippets`, {
            title: "Clave secreta",
            code: "console.log('Mis secretos de la NASA');",
            language: "javascript"
        }, {
            headers: { Authorization: `Bearer ${tokenA}` }
        });
        snippetId = resSnippet.data.data._id;
        console.log(`✅ Snippet creado por User A. (ID: ${snippetId})\n`);

        // 3. Ataque: Intentar borrar ese snippet usando el Token del User B.
        console.log("3️⃣  ATAQUE: User B intentará borrar el snippet de User A...");
        try {
            await axios.delete(`${BASE_URL}/snippets/${snippetId}`, {
                headers: { Authorization: `Bearer ${tokenB}` }
            });
            // Si llega aquí, significa que la request fue exitosa (código 20x), ¡lo cual es un error en nuestra app!
            console.error("❌ FATAL: El User B logró borrar el snippet de User A. (El servidor debe denegar la acción). ¡RETO REPROBADO!");
            process.exit(1);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 404)) {
                console.log(`✅ ÉXITO: El servidor denegó la acción. Código devuelto: ${error.response.status} - Mensaje: ${error.response.data.message}`);
                console.log("🎉 PRUEBA DE FUEGO SUPERADA. El Muro de Privacidad funciona correctamente.");
            } else {
                console.error(`⚠️ Test falló, pero por una razón diferente. Status code esperado 401/404, pero se obtuvo: ${error.response?.status || error.message}`);
            }
        }

    } catch (error) {
        console.error("Error inesperado en el script QA:", error.response?.data || error.message);
    } finally {
        await mongoose.disconnect();
    }
}

runQA();
