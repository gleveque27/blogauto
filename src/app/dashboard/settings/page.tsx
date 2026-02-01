import { createClient } from '@/lib/supabase/server'
import { Button } from "@/components/ui/button"
import { signout } from "@/app/auth/actions"
import { User, Shield, Key, LogOut } from "lucide-react"

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="max-w-4xl mx-auto w-full space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences.</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Section */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex items-center gap-4 border-b">
                        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Profile Information</h3>
                            <p className="text-sm text-muted-foreground">Basic details about your account.</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input
                                className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed opacity-70"
                                value={user?.email || ""}
                                disabled
                            />
                        </div>
                        <div className="pt-2">
                            <p className="text-xs text-muted-foreground">
                                Your account is managed via Supabase Auth.
                            </p>
                        </div>
                    </div>
                </div>

                {/* API Section */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex items-center gap-4 border-b">
                        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                            <Key className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Integrations</h3>
                            <p className="text-sm text-muted-foreground">API Keys and external services.</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-indigo-600" />
                                <div>
                                    <div className="text-sm font-semibold">Gemini AI API</div>
                                    <div className="text-xs text-muted-foreground">
                                        {process.env.GEMINI_API_KEY ? "Connected" : "Not connected"}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground italic">
                                Managed via .env.local
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-xl border border-red-200 bg-red-50/10 text-card-foreground shadow-sm">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground mb-4">Actions that cannot be undone or sign out from your account.</p>

                        <form action={signout}>
                            <Button variant="destructive" className="flex items-center gap-2">
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
