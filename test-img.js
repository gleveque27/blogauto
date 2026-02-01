async function testImage() {
    const url = "https://image.pollinations.ai/prompt/como-lavar-as-roupas-com-vinagre-professional-blog-feature";
    console.log("Testing URL:", url);
    try {
        const res = await fetch(url);
        console.log("Status:", res.status);
        console.log("Content-Type:", res.headers.get("content-type"));
        if (res.ok && res.headers.get("content-type")?.includes("image")) {
            console.log("SUCCESS: URL is a valid image.");
        } else {
            console.log("FAILURE: URL does not return an image.");
        }
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}
testImage();
