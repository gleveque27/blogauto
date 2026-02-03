/**
 * Image Generation Workflow
 * 
 * This module handles the complete image generation pipeline:
 * 1. Generate image using Hugging Face Stable Diffusion API
 * 2. Upload the generated image to ImgBB
 * 3. Return the permanent ImgBB URL
 */

interface ImageGenerationResult {
    success: boolean
    imageUrl?: string
    error?: string
}

/**
 * Generate an image using Hugging Face Stable Diffusion API
 * @param prompt - The text prompt for image generation
 * @returns ArrayBuffer containing the image data
 */
async function generateImageWithHuggingFace(prompt: string): Promise<ArrayBuffer> {
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY

    if (!HF_API_KEY) {
        throw new Error('HUGGINGFACE_API_KEY is not configured')
    }

    const response = await fetch(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
            }),
        }
    )

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Hugging Face API error (${response.status}): ${errorText}`)
    }

    // The response is the image binary data
    return await response.arrayBuffer()
}

/**
 * Upload an image to ImgBB
 * @param imageBuffer - The image data as ArrayBuffer
 * @returns The permanent URL of the uploaded image
 */
async function uploadToImgBB(imageBuffer: ArrayBuffer): Promise<string> {
    const IMGBB_API_KEY = process.env.IMGBB_API_KEY

    if (!IMGBB_API_KEY) {
        throw new Error('IMGBB_API_KEY is not configured')
    }

    // Convert ArrayBuffer to base64
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    // Create form data for ImgBB
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

    // Return the permanent URL
    return data.data.url
}

/**
 * Complete workflow: Generate image with Hugging Face and upload to ImgBB
 * @param prompt - The text prompt for image generation
 * @returns Result object with success status and image URL or error message
 */
export async function generateAndUploadImage(prompt: string): Promise<ImageGenerationResult> {
    try {
        console.log('[Image Generation] Starting workflow for prompt:', prompt)

        // Step 1: Generate image with Hugging Face
        console.log('[Image Generation] Step 1: Generating image with Hugging Face...')
        const imageBuffer = await generateImageWithHuggingFace(prompt)
        console.log('[Image Generation] Image generated successfully, size:', imageBuffer.byteLength, 'bytes')

        // Step 2: Upload to ImgBB
        console.log('[Image Generation] Step 2: Uploading to ImgBB...')
        const imageUrl = await uploadToImgBB(imageBuffer)
        console.log('[Image Generation] Upload successful, URL:', imageUrl)

        return {
            success: true,
            imageUrl,
        }
    } catch (error: any) {
        console.error('[Image Generation] Error:', error)

        // Provide user-friendly error messages
        let errorMessage = error.message || 'Unknown error occurred'

        if (errorMessage.includes('HUGGINGFACE_API_KEY')) {
            errorMessage = 'Hugging Face API key is not configured. Please check your environment variables.'
        } else if (errorMessage.includes('IMGBB_API_KEY')) {
            errorMessage = 'ImgBB API key is not configured. Please check your environment variables.'
        } else if (errorMessage.includes('503') || errorMessage.includes('loading')) {
            errorMessage = 'Hugging Face model is loading. Please try again in a few moments.'
        } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
            errorMessage = 'API authentication failed. Please check your API keys.'
        }

        return {
            success: false,
            error: errorMessage,
        }
    }
}
