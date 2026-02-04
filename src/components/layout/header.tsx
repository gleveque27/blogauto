import Link from "next/link"
import { Button } from "@/components/ui/button" // Placeholder, will create UI button later or use inline for now
import { ArrowRight, Menu, X, Check, BarChart3, Globe, Zap } from "lucide-react"

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                        <Zap className="h-5 w-5 fill-current" />
                    </div>
                    <span>Noticias</span>
                </div>

                <nav className="hidden md:flex gap-6 text-sm font-medium">
                    <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
                    <Link href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
                    <Link href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:text-indigo-600 hidden sm:block">
                        Log in
                    </Link>
                    <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    )
}
