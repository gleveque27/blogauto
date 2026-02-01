const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

function getEnv() {
    try {
        const envPath = path.resolve(process.cwd(), ".env.local");
        const envContent = fs.readFileSync(envPath, "utf-8");
        const lines = envContent.split("\n");
        const env = {};
        lines.forEach(line => {
            const parts = line.split("=");
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join("=").trim();
                env[key] = value;
            }
        });
        return env;
    } catch (e) {
        console.error("Error reading .env.local:", e.message);
        return {};
    }
}

async function checkData() {
    const env = getEnv();
    if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("❌ Missing Supabase credentials in .env.local");
        return;
    }

    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    console.log("📡 Connecté à :", env.NEXT_PUBLIC_SUPABASE_URL);

    // Get table structure (via a trick or just checking data)
    console.log("🔍 Test de la colonne 'image_url'...");
    const { data: testData, error: testError } = await supabase.from('posts').select('image_url').limit(1);

    if (testError) {
        console.error("❌ Erreur sur 'image_url' :", testError.message);
        console.log("💡 Essayons de voir toutes les colonnes disponibles...");
        const { data: columnsData, error: columnsError } = await supabase.from('posts').select('*').limit(1);
        if (columnsError) {
            console.error("❌ Erreur fatale :", columnsError.message);
        } else if (columnsData && columnsData.length > 0) {
            console.log("✅ Colonnes trouvées :", Object.keys(columnsData[0]).join(", "));
        } else {
            console.log("⚠️ La table 'posts' semble vide.");
        }
    } else {
        console.log("✅ La colonne 'image_url' existe !");

        console.log("🔍 Récupération des posts avec images...");
        const { data: posts, error } = await supabase.from('posts').select('title, image_url').order('created_at', { ascending: false });

        if (posts && posts.length > 0) {
            posts.forEach((p, i) => {
                console.log(`${i + 1}. [${p.image_url ? 'IMAGE OK' : 'PAS D_IMAGE'}] ${p.title}`);
                if (p.image_url) console.log(`   URL: ${p.image_url}`);
            });
        } else {
            console.log("⚠️ Aucun post trouvé.");
        }
    }
}

checkData();
