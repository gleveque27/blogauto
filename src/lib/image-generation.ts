/**
 * Image Generation Workflow
 * 
 * This module handles image generation using Replicate API
 * with FLUX.1 Schnell model for fast, high-quality images
 */

interface ImageGenerationResult {
    success: boolean
    imageUrl?: string
    error?: string
}

/**
 * Generate an image using Replicate FLUX.1 Schnell
 * @param prompt - The text prompt for image generation
 * @returns URL of the generated image
 */
async function generateImageWithReplicate(prompt: string): Promise<string> {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

    if (!REPLICATE_API_TOKEN) {
        throw new Error('REPLICATE_API_TOKEN is not configured')
    }

    console.log('[Image Generation] Creating prediction with Replicate...')

    // Step 1: Create a prediction using FLUX.1 Schnell
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

    // Check if prediction succeeded
    if (prediction.status === 'failed') {
        throw new Error('Image generation failed: ' + (prediction.error || 'Unknown error'))
    }

    // If not completed, poll for result
    let imageUrl = prediction.output?.[0]
    if (!imageUrl) {
        console.log('[Image Generation] Waiting for prediction to complete...')
        
        const maxAttempts = 30 // 30 seconds max
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

            if (!statusResponse.ok) {
                throw new Error('Failed to check prediction status')
            }

            const status = await statusResponse.json()

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

    console.log('[Image Generation] Image generated successfully:', imageUrl)
    return imageUrl
}

/**
 * Upload an image from URL to ImgBB for permanent hosting
 * @param imageUrl - The temporary image URL from Replicate
 * @returns The permanent URL of the uploaded image on ImgBB
 */
async function uploadToImgBBFromURL(imageUrl: string): Promise<string> {
    const IMGBB_API_KEY = process.env.IMGBB_API_KEY

    if (!IMGBB_API_KEY) {
        throw new Error('IMGBB_API_KEY is not configured')
    }

    console.log('[Image Generation] Downloading image from Replicate...')

    // Fetch the image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
        throw new Error('Failed to fetch generated image from Replicate')
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    
    // Verify we got data
    if (imageBuffer.byteLength === 0) {
        throw new Error('Downloaded image is empty')
    }
    
    console.log(`[Image Generation] Image downloaded (${imageBuffer.byteLength} bytes), encoding to base64...`)
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    console.log('[Image Generation] Uploading to ImgBB...')

    // Upload to ImgBB using URLSearchParams (works better in Node.js)
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

    return data.data.url
}

/**
 * Complete workflow: Generate image with Replicate and upload to ImgBB
 * @param prompt - The text prompt for image generation
 * @returns Result object with success status and image URL or error message
 */
export async function generateAndUploadImage(prompt: string): Promise<ImageGenerationResult> {
    try {
        console.log('[Image Generation] Starting workflow for prompt:', prompt)

        // Step 1: Generate image with Replicate
        console.log('[Image Generation] Step 1: Generating image with Replicate FLUX.1...')
        const tempImageUrl = await generateImageWithReplicate(prompt)

        // Step 2: Upload to ImgBB for permanent hosting
        console.log('[Image Generation] Step 2: Uploading to ImgBB for permanent hosting...')
        const imageUrl = await uploadToImgBBFromURL(tempImageUrl)
        console.log('[Image Generation] Workflow completed successfully! URL:', imageUrl)

        return {
            success: true,
            imageUrl,
        }
    } catch (error: any) {
        console.error('[Image Generation] Error:', error)

        // Provide user-friendly error messages
        let errorMessage = error.message || 'Unknown error occurred'

        if (errorMessage.includes('REPLICATE_API_TOKEN')) {
            errorMessage = 'Replicate API token is not configured. Please check your environment variables.'
        } else if (errorMessage.includes('IMGBB_API_KEY')) {
            errorMessage = 'ImgBB API key is not configured. Please check your environment variables.'
        } else if (errorMessage.includes('timed out')) {
            errorMessage = 'Image generation took too long. Please try again.'
        } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
            errorMessage = 'API authentication failed. Please check your API token.'
        } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
            errorMessage = 'API quota exceeded. Please check your Replicate account.'
        }

        return {
            success: false,
            error: errorMessage,
        }
    }
}
