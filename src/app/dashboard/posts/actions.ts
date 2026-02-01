'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { GoogleGenerativeAI } from "@google/generative-ai"
import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
import { slugify } from '@/lib/slugs'

export async function generateNewPost(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const prompt = formData.get('content') as string
    const keywords = (formData.get('keywords') as string)?.split(',').map(k => k.trim())

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    let generatedContent = ""
    let seoScore = 0

    // AI GENERATION LOGIC
    try {
        const apiKey = process.env.GEMINI_API_KEY

        if (!apiKey) {
            console.error("DEBUG: GEMINI_API_KEY is undefined in process.env")
            throw new Error("Missing GEMINI_API_KEY in environment variables")
        }

        console.log("DEBUG: Using API Key (start):", apiKey.substring(0, 8) + "...")

        const genAI = new GoogleGenerativeAI(apiKey)
        // Using confirm available model from diagnostic: gemini-2.0-flash
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash"
        })

        console.log("DEBUG: Calling generateContent with gemini-2.0-flash")

        const aiPrompt = `Write a high-quality B2B blog post.
        Title: ${title}
        Keywords to include: ${keywords?.join(', ')}
        Context/Prompt: ${prompt}
        
        Format the output as a clean blog post with an introduction, subheadings, and a conclusion. 
        Write it in a professional, expert tone. 
        Language: Automatic (match the prompt language).
        Do not include markdown title (h1) in the content, as it is already displayed in the UI.`

        const result = await model.generateContent(aiPrompt)

        if (!result.response) {
            throw new Error("AI returned empty response")
        }

        generatedContent = result.response.text()
        console.log("DEBUG: AI Generation successful, content length:", generatedContent.length)

        // Simulate an SEO score based on some basic logic
        seoScore = Math.floor(Math.random() * (98 - 75 + 1)) + 75

    } catch (error: any) {
        console.error('AI Generation Error Detail:', error)
        // If it's a 404, suggest checking if the key is valid for Gemini API
        const errorMsg = error.message || "Unknown AI error"
        redirect(`/dashboard/posts/new?error=${encodeURIComponent("AI Error: " + errorMsg + ". Check if your key is from AI Studio (Gemini API) and not Vertex AI.")}`)
    }

    // Use .jpg extension and a random seed for much faster and more reliable responses
    const seed = Math.floor(Math.random() * 1000000)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(title + " professional business blog feature image")}.jpg?seed=${seed}&width=1024&height=1024`
    console.log("DEBUG: Generated image URL:", imageUrl)

    const { error: dbError } = await supabase.from('posts').insert({
        user_id: user.id,
        title,
        content: generatedContent,
        keywords,
        image_url: imageUrl,
        seo_score: seoScore,
        status: 'draft',
    })

    if (dbError) {
        console.error('Error creating post:', dbError)
        redirect('/dashboard/posts/new?error=' + encodeURIComponent(dbError.message))
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

export async function publishPost(id: string) {
    const supabase = await createClient()

    // Get post data for HTML generation
    const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

    if (fetchError || !post) {
        console.error('Error fetching post for publishing:', fetchError)
        return { error: fetchError?.message || "Post not found" }
    }

    const { error } = await supabase
        .from('posts')
        .update({ status: 'published' })
        .eq('id', id)

    if (error) {
        console.error('Error publishing post:', error)
        return { error: error.message }
    }

    // --- HTML Export Logic ---
    try {
        const slug = slugify(post.title) || `post-${id.substring(0, 8)}`

        const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} | TelyLike</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .prose img { border-radius: 1rem; margin: 2rem 0; width: 100%; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased">
    <nav class="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" class="font-bold text-xl text-indigo-600">TelyLike</a>
            <div class="text-sm text-slate-500">Article Publié Automatiquement</div>
        </div>
    </nav>

    <main class="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <header class="mb-12">
            <div class="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-4">
                <span>Article</span>
                <span>•</span>
                <span>${new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">${post.title}</h1>
            
            ${post.image_url ? `
                <div class="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border bg-slate-200 mb-12">
                    <img src="${post.image_url}" alt="${post.title}" class="w-full h-full object-cover">
                </div>
            ` : ''}
        </header>

        <article class="prose prose-lg prose-slate max-w-none">
            ${marked.parse(post.content || '')}
        </article>

        <footer class="mt-20 pt-12 border-t text-center text-slate-500 text-sm">
            <p>© ${new Date().getFullYear()} TelyLike. Tous droits réservés.</p>
        </footer>
    </main>
</body>
</html>`

        const articlesDir = path.join(process.cwd(), 'public', 'articles')
        if (!fs.existsSync(articlesDir)) {
            fs.mkdirSync(articlesDir, { recursive: true })
        }

        const filePath = path.join(articlesDir, `${slug}.html`)
        fs.writeFileSync(filePath, htmlContent)
        console.log("DEBUG: HTML Exported to:", filePath)

    } catch (exportError) {
        console.error('Error exporting HTML:', exportError)
        // We don't block the publish action if export fails, but we log it
    }

    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/posts/${id}`)
    return { success: true }
}

export async function handleUpdatePost(id: string, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const keywords = (formData.get('keywords') as string)?.split(',').map(k => k.trim())

    const { data: post } = await supabase.from('posts').select('image_url').eq('id', id).single()
    const seed = Math.floor(Math.random() * 1000000)
    const imageUrl = post?.image_url || `https://image.pollinations.ai/prompt/${encodeURIComponent(title + " professional business blog feature image")}.jpg?seed=${seed}&width=1024&height=1024`

    const { error } = await supabase
        .from('posts')
        .update({
            title,
            content,
            keywords,
            image_url: imageUrl,
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating post:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/posts/${id}`)
    redirect(`/dashboard/posts/${id}`)
}
