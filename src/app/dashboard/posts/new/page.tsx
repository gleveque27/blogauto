import { Button } from "@/components/ui/button"
import { generateNewPost } from "../actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function NewPostPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const { error } = await searchParams

    return (
        <div className="max-w-2xl mx-auto w-full space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Create New Article</h1>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    Error: {decodeURIComponent(error)}
                </div>
            )}

            <form action={generateNewPost} className="space-y-6 bg-background p-6 rounded-xl border shadow-sm">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Article Title</label>
                    <input
                        id="title"
                        name="title"
                        placeholder="How AI is changing B2B marketing..."
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="keywords" className="text-sm font-medium">Keywords (comma separated)</label>
                    <input
                        id="keywords"
                        name="keywords"
                        placeholder="SEO, AI, B2B Marketing"
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">Content / Prompt for AI</label>
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Describe what you want the article to be about..."
                        className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        required
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button asChild variant="outline" type="button">
                        <Link href="/dashboard">Cancel</Link>
                    </Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                        Generate Article
                    </Button>
                </div>
            </form>
        </div>
    )
}
