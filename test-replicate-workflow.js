require('dotenv').config({ path: '.env.local' })

/**
 * Test the complete image generation workflow with Replicate + ImgBB
 */

async function generateImageWithReplicate(prompt) {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

    if (!REPLICATE_API_TOKEN) {
        throw new Error('REPLICATE_API_TOKEN is not configured')
    }

    console.log('🎨 Creating prediction with Replicate FLUX.1 Schnell...')
    console.log('📝 Prompt:', prompt)

    // Create prediction with FLUX.1 Schnell (fast model)
    const predictionResponse = await fetch(
        'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
        {
            method: 'POST',
            headers: {
                'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
                'Prefer': 'wait',
            },
            body: JSON.stringify({
                input: {
                    prompt: prompt,
                    num_outputs: 1,
                    aspect_ratio: '1:1',
                    output_format: 'jpg',
                    output_quality: 90,
                    go_fast: true,
                },
            }),
        }
    )

    if (!predictionResponse.ok) {
        const errorText = await predictionResponse.text()
        throw new Error(`Replicate API error (${predictionResponse.status}): ${errorText}`)
    }

    const prediction = await predictionResponse.json()
    console.log('📊 Prediction created:', prediction.id)
    console.log('⏱️  Status:', prediction.status)

    // Wait for completion if needed
    let imageUrl = prediction.output?.[0]
    
    if (!imageUrl && prediction.status !== 'succeeded') {
        console.log('⏳ Waiting for image generation...')
        
        const maxAttempts = 30
        for (let i = 0; i < maxAttempts; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const statusResponse = await fetch(
                `https://api.replicate.com/v1/predictions/${prediction.id}`,
                {
                    headers: {
                        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                    },
                }
            )

            const status = await statusResponse.json()
            console.log(`⏱️  Attempt ${i + 1}/${maxAttempts} - Status: ${status.status}`)

            if (status.status === 'succeeded' && status.output?.[0]) {
                imageUrl = status.output[0]
                break
            }

            if (status.status === 'failed') {
                throw new Error('Image generation failed: ' + (status.error || 'Unknown error'))
            }
        }

        if (!imageUrl) {
            throw new Error('Image generation timed out')
        }
    }

    console.log('✅ Image generated successfully!')
    console.log('🔗 Replicate URL:', imageUrl)
    return imageUrl
}

async function uploadToImgBB(imageUrl) {
    const IMGBB_API_KEY = process.env.IMGBB_API_KEY

    if (!IMGBB_API_KEY) {
        throw new Error('IMGBB_API_KEY is not configured')
    }

    console.log('📥 Downloading image from Replicate...')

    // Fetch the image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
        throw new Error('Failed to fetch generated image')
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    
    if (imageBuffer.byteLength === 0) {
        throw new Error('Downloaded image is empty')
    }
    
    console.log(`✅ Image downloaded (${imageBuffer.byteLength} bytes)`)
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    console.log('📤 Uploading to ImgBB...')

    // Upload to ImgBB using URLSearchParams
    const formBody = new URLSearchParams()
    formBody.append('image', base64Image)

    const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody.toString(),
        }
    )

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`ImgBB API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()

    if (!data.success || !data.data?.url) {
        throw new Error('ImgBB upload failed: Invalid response format')
    }

    console.log('✅ Upload successful!')
    console.log('🔗 Permanent URL:', data.data.url)
    return data.data.url
}

async function main() {
    console.log('🚀 Starting Replicate + ImgBB Workflow Test\n')

    const testPrompt = 'A futuristic office with neon lights, professional photography, high quality, 4k'

    try {
        // Step 1: Generate with Replicate
        const tempUrl = await generateImageWithReplicate(testPrompt)

        // Step 2: Upload to ImgBB
        const permanentUrl = await uploadToImgBB(tempUrl)

        console.log('\n🎉 Workflow completed successfully!')
        console.log('📸 Final Image URL:', permanentUrl)
    } catch (error) {
        console.error('\n❌ Workflow failed:', error.message)
        process.exit(1)
    }
}

main()
