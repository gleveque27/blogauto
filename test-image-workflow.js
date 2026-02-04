/**
 * Test script for Image Generation Workflow
 * 
 * This script tests the complete workflow:
 * 1. Generate image with Hugging Face
 * 2. Upload to ImgBB
 * 3. Return permanent URL
 * 
 * Usage: node test-image-workflow.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' })

async function generateImageWithHuggingFace(prompt) {
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY

    if (!HF_API_KEY) {
        throw new Error('HUGGINGFACE_API_KEY is not configured')
    }

    console.log('🎨 Generating image with Hugging Face...')
    console.log('📝 Prompt:', prompt)

    const response = await fetch(
        'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
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

    const imageBuffer = await response.arrayBuffer()
    console.log('✅ Image generated:', imageBuffer.byteLength, 'bytes')

    return imageBuffer
}

async function uploadToImgBB(imageBuffer) {
    const IMGBB_API_KEY = process.env.IMGBB_API_KEY

    if (!IMGBB_API_KEY) {
        throw new Error('IMGBB_API_KEY is not configured')
    }

    console.log('📤 Uploading to ImgBB...')

    // Convert ArrayBuffer to base64
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    // Create form data
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
    console.log('🔗 Image URL:', data.data.url)
    console.log('📊 Image info:', {
        size: data.data.size,
        width: data.data.width,
        height: data.data.height,
    })

    return data.data.url
}

async function testWorkflow() {
    console.log('🚀 Starting Image Generation Workflow Test\n')

    const testPrompt = 'A futuristic office with neon lights, professional photography, high quality'

    try {
        // Step 1: Generate image
        const imageBuffer = await generateImageWithHuggingFace(testPrompt)

        // Step 2: Upload to ImgBB
        const imageUrl = await uploadToImgBB(imageBuffer)

        console.log('\n✨ Workflow completed successfully!')
        console.log('🎉 Final image URL:', imageUrl)

    } catch (error) {
        console.error('\n❌ Workflow failed:', error.message)

        if (error.message.includes('503') || error.message.includes('loading')) {
            console.log('\n💡 Tip: The Hugging Face model might be loading. Wait 20-30 seconds and try again.')
        } else if (error.message.includes('401') || error.message.includes('403')) {
            console.log('\n💡 Tip: Check your API keys in .env.local')
        }
    }
}

// Run the test
testWorkflow()
