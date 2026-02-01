import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { signup } from "@/app/auth/actions"

export default function RegisterPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <div className="mx-auto w-full max-w-[350px] space-y-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white mb-2">
                        <Zap className="h-6 w-6 fill-current" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email below to create your account
                    </p>
                </div>

                <form action={signup} className="space-y-4">
                    <div className="space-y-2">
                        <input name="email" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" placeholder="name@example.com" type="email" required />
                    </div>
                    <div className="space-y-2">
                        <input name="password" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" placeholder="Password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Sign Up</Button>
                </form>

                <div className="px-8 text-center text-sm text-muted-foreground">
                    <Link href="/login" className="hover:text-brand underline underline-offset-4">
                        Already have an account? Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}
