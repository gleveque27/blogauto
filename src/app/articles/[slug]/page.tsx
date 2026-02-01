import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Calendar, User } from 'lucide-react'
import { marked } from 'marked'
import Link from 'next/link'

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = await createClient()

    // Query by slug instead of ID
    const { data: post } = await supabase
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
        .single()

    if (!post) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl text-indigo-600">
                        TelyLike
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
                            <div className="text-sm font-semibold">{post.profiles?.full_name || 'Expert TelyLike'}</div>
                            <div className="text-xs text-slate-500">AI Content Strategist</div>
                        </div>
                    </div>
                </header>

                <article className="prose prose-lg prose-slate max-w-none prose-indigo">
                    <div
                        className="leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: marked.parse(post.content || '') }}
                    />
                </article>

                <footer className="mt-20 pt-12 border-t text-center text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} TelyLike. Tous droits réservés.</p>
                </footer>
            </main>
        </div>
    )
}
