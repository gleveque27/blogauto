import Link from "next/link"
import { Zap, LayoutDashboard, FileText, Settings, User } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="hidden w-64 border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 font-bold text-lg">
                        <div className="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center text-white mr-2">
                            <Zap className="h-4 w-4 fill-current" />
                        </div>
                        <span>TelyLike</span>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1 py-4">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2 text-indigo-900 transition-all hover:text-indigo-900"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/dashboard/posts"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <FileText className="h-4 w-4" />
                                Posts
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </Link>
                        </nav>
                    </div>
                    <div className="mt-auto p-4">
                        {/* User Profile Snippet */}
                        <div className="flex items-center gap-3 rounded-lg border p-3 bg-background">
                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                                <User className="h-4 w-4 text-slate-500" />
                            </div>
                            <div className="text-xs">
                                <div className="font-semibold">Demo User</div>
                                <div className="text-muted-foreground">free plan</div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <div className="w-full flex-1">
                        {/* Breadcrumbs or Title could go here */}
                        <span className="font-semibold">Overview</span>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/10">
                    {children}
                </main>
            </div>
        </div>
    )
}
