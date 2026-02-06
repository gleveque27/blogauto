import Link from "next/link"
import { Zap } from "lucide-react"

export default function RegisterPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <div className="mx-auto w-full max-w-[450px] space-y-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="h-12 w-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white mb-2">
                        <Zap className="h-8 w-8 fill-current" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Inscriptions fermées
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Les nouvelles inscriptions sont actuellement désactivées. 
                        Si vous avez déjà un compte, veuillez vous connecter.
                    </p>
                    <Link 
                        href="/login"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-6 py-2 w-full mt-4"
                    >
                        Se connecter
                    </Link>
                </div>
            </div>
        </div>
    )
}
