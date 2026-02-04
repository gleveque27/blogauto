import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Calendar, User } from 'lucide-react'
import { marked } from 'marked'
import Link from 'next/link'
import { CurrentYear } from '@/components/current-year'

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = await createClient()

    // Attempt to find by slug first
    let { data: post } = await supabase
        .from('posts')
        .select(`
            *,
            profiles (
                full_name,
                avatar_url
            )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle()

    // If not found by slug, attempt to find by ID (UUID check)
    if (!post && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
        const { data: postById } = await supabase
            .from('posts')
            .select(`
                *,
                profiles (
                    full_name,
                    avatar_url
                )
            `)
            .eq('id', slug)
            .eq('status', 'published')
            .maybeSingle()

        post = postById
    }

    if (!post) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl text-indigo-600">
                        Noticias
                    </Link>
                    <div className="text-sm text-slate-500">Article Publié</div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
                <header className="mb-12">
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-4">
                        <span>Article</span>
                        <span>•</span>
                        <Calendar className="h-4 w-4" />
                        <span suppressHydrationWarning>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
                        {post.title}
                    </h1>

                    {post.image_url && (
                        <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border bg-slate-200 mb-12">
                            <img
                                src={post.image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-3 py-6 border-y">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            {post.profiles?.avatar_url ? (
                                <img src={post.profiles.avatar_url} alt="" className="h-full w-full rounded-full" />
                            ) : (
                                <User className="h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <div className="text-sm font-semibold">{post.profiles?.full_name || 'Expert Noticias'}</div>
                            <div className="text-xs text-slate-500">AI Content</div>
                        </div>
                    </div>
                </header>

                <article className="prose prose-lg prose-slate max-w-none prose-indigo">
                    {/* Debug: Show if content exists */}
                    {!post.content && (
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                            ⚠️ No content available for this article
                        </div>
                    )}
                    <div
                        className="leading-relaxed text-slate-700"
                        dangerouslySetInnerHTML={{ __html: marked.parse(post.content || 'No content') }}
                    />
                </article>


            </main>
        </div>
    )
}
