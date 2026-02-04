require('dotenv').config({ path: '.env.local' })

/**
 * Test the complete image generation workflow:
 * 1. Generate image with fal.ai
 * 2. Upload to ImgBB
 */

async function generateImageWithFal(prompt) {
    console.log('🎨 Generating image with fal.ai...')
    console.log('📝 Prompt:', prompt)

    const response = await fetch(
        'https://fal.run/fal-ai/flux/schnell',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                image_size: {
                    width: 1024,
                    height: 1024
                },
                num_inference_steps: 4,
                num_images: 1,
            }),
        }
    )

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`fal.ai API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.images || !data.images[0] || !data.images[0].url) {
        throw new Error('fal.ai returned invalid response format')
    }

    console.log('✅ Image generated successfully!')
    console.log('🔗 Temporary URL:', data.images[0].url)
    return data.images[0].url
}

async function uploadToImgBB(imageUrl) {
    const IMGBB_API_KEY = process.env.IMGBB_API_KEY

    if (!IMGBB_API_KEY) {
        throw new Error('IMGBB_API_KEY is not configured')
    }

    console.log('📤 Uploading to ImgBB...')

    // Fetch the image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
        throw new Error('Failed to fetch generated image')
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    // Upload to ImgBB
    const FormData = require('form-data')
    const formData = new FormData()
    formData.append('image', base64Image)

    const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
            method: 'POST',
            body: formData,
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
    console.log('🚀 Starting Image Generation Workflow Test\n')

    const testPrompt = 'A futuristic office with neon lights, professional photography, high quality'

    try {
        // Step 1: Generate with fal.ai
        const tempUrl = await generateImageWithFal(testPrompt)

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
