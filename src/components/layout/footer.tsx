import Link from "next/link"
import { Zap } from "lucide-react"
import { CurrentYear } from "@/components/current-year"

export default function Footer() {
    return (
        <footer className="border-t bg-muted/20">
            <div className="container py-12 md:py-16L">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                <Zap className="h-5 w-5 fill-current" />
                            </div>
                            <span>Noticias</span>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            Autonomous AI agent for B2B content marketing. Autopilot your growth.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                            <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-foreground">Case Studies</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground">About</Link></li>
                            <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                            <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}
