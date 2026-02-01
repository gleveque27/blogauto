import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { handleUpdatePost } from "../../actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

    if (!post) {
        notFound()
    }

    const handleUpdate = async (formData: FormData) => {
        'use server'
        await handleUpdatePost(id, formData)
    }

    return (
        <div className="max-w-4xl mx-auto w-full space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/posts/${id}`} className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Edit Article</h1>
            </div>

            <form action={handleUpdate} className="space-y-6 bg-background p-6 rounded-xl border shadow-sm">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Article Title</label>
                    <input
                        id="title"
                        name="title"
                        defaultValue={post.title}
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="keywords" className="text-sm font-medium">Keywords (comma separated)</label>
                    <input
                        id="keywords"
                        name="keywords"
                        defaultValue={post.keywords?.join(', ')}
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        defaultValue={post.content}
                        className="flex min-h-[400px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        required
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button asChild variant="outline" type="button">
                        <Link href={`/dashboard/posts/${id}`}>Cancel</Link>
                    </Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    )
}
