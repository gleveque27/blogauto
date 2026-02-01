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

async function listModels() {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("❌ Erreur : GEMINI_API_KEY non trouvée dans .env.local");
        return;
    }

    console.log(`🔍 Diagnostic avec la clé : ${apiKey.substring(0, 8)}...`);

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log("📡 Appel de listModels()...");
        // Note: The @google/generative-ai SDK doesn't have a top-level listModels 
        // in the way we expect. We need to use the REST API directly or a different method.
        // Actually, let's use fetch directly to see what's going on.

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ Erreur API :", JSON.stringify(data.error, null, 2));
        } else {
            console.log("✅ Liste des modèles récupérée avec succès !");
            if (data.models) {
                data.models.forEach(m => console.log(`- ${m.name}`));
            } else {
                console.log("⚠️ Aucun modèle retourné.");
            }
        }
    } catch (error) {
        console.error("❌ Erreur de connexion :", error.message);
    }
}

listModels();
