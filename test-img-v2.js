async function test(name, url) {
    console.log(`Testing ${name}...`);
    const start = Date.now();
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        console.log(`  ${name} Status: ${res.status}, Type: ${res.headers.get("content-type")}, Time: ${Date.now() - start}ms`);
    } catch (e) {
        console.log(`  ${name} ERROR: ${e.name === 'AbortError' ? 'Timeout' : e.message}`);
    }
}

async function runTests() {
    const prompt = "como lavar as roupas com vinagre";
    await test("Direct Image API", `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
    await test("With Params", `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`);
    await test("With Extension", `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}.jpg`);
    await test("Main Site P-format", `https://pollinations.ai/p/${encodeURIComponent(prompt)}`);
}

runTests();
