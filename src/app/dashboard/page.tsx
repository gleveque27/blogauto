import { createClient } from '@/lib/supabase/server'
import { Button } from "@/components/ui/button"
import { Plus, FileText, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    const { count: totalCount } = await supabase.from('posts').select('*', { count: 'exact', head: true })
    const { count: publishedCount } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published')
    const { count: draftCount } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'draft')

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                    <Link href="/dashboard/posts/new">
                        <Plus className="mr-2 h-4 w-4" /> New Article
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {[
                    { label: "Total Posts", value: totalCount || 0 },
                    { label: "Published", value: publishedCount || 0 },
                    { label: "Drafts", value: draftCount || 0 },
                    { label: "SEO Score (Avg)", value: "0" }
                ].map((stat, i) => (
                    <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                        <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <div className="col-span-2 grid items-start gap-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold text-lg">Recent Generations</h3>

                    {!user && (
                        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg text-sm border border-yellow-200">
                            Warning: Session not detected. Please try logging out and in again.
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                            Supabase Error: {error.message} (Code: {error.code})
                        </div>
                    )}

                    {posts && posts.length > 0 ? (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div key={post.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-md overflow-hidden bg-indigo-100 flex-shrink-0">
                                            {post.image_url ? (
                                                <img src={post.image_url} alt={post.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-indigo-600">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium">{post.title}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1" suppressHydrationWarning>
                                                <Calendar className="h-3 w-3" />
                                                {new Date(post.created_at).toLocaleDateString('en-US')} • {post.status}
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/posts/${post.id}`} className="text-muted-foreground hover:text-indigo-600 transition-colors">
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border border-dashed rounded-lg h-48 flex items-center justify-center bg-muted/50">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-4">No content generated yet.</p>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/dashboard/posts/new">Create Your First Post</Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
