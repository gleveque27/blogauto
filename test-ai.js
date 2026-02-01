const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

function getApiKey() {
    try {
        const envPath = path.resolve(process.cwd(), ".env.local");
        const envContent = fs.readFileSync(envPath, "utf-8");
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        return match ? match[1].trim() : null;
    } catch (e) {
        return null;
    }
}

async function testAI() {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("❌ Erreur : GEMINI_API_KEY non trouvée dans .env.local");
        return;
    }

    console.log(`🔍 Test avec la clé commençant par : ${apiKey.substring(0, 8)}...`);

    const genAI = new GoogleGenerativeAI(apiKey);

    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"];

    for (const modelName of models) {
        try {
            console.log(`📡 Test du modèle : ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say 'OK'");
            console.log(`✅ SUCCÈS : Le modèle '${modelName}' fonctionne !`);
            // If we found a working model, let's suggest it
            return;
        } catch (e) {
            console.log(`❌ ÉCHEC : ${modelName} -> ${e.message}`);
        }
    }
}

testAI();
