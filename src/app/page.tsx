import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { ArrowRight, Check, Sparkles, Wand2, BarChart, Globe2 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          <div className="absolute left-[50%] top-0 -z-10 -translate-x-1/2 blur-3xl opacity-30 w-[40rem] h-[30rem] bg-indigo-500 rounded-full"></div>

          <div className="container flex flex-col items-center text-center max-w-5xl mx-auto px-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-indigo-100 text-indigo-700 hover:bg-indigo-200 mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              New: AI Autopilot 2.0
            </div>

            <h1 className="text-4xl md:text-6xl/tight font-extrabold tracking-tight mb-6">
              B2B Content Marketing on <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Autopilot</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Turn your blog into a lead generation machine. Our autonomous AI agent researchers, writes, and optimizes content that ranks and converts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-md bg-indigo-600 px-8 text-base font-medium text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:scale-105">
                Start for free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link href="#demo" className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                View Demo
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-16 pt-8 border-t w-full max-w-4xl opacity-70">
              <p className="text-sm text-center text-muted-foreground mb-6 uppercase tracking-wider font-semibold">Trusted by innovative teams</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-60">
                {/* Placeholders for logos */}
                <div className="text-xl font-bold">ACME Inc.</div>
                <div className="text-xl font-bold">Globex</div>
                <div className="text-xl font-bold">Soylent Corp</div>
                <div className="text-xl font-bold">Initech</div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950/50">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Why choose TelyLike?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We don't just write text. We build a comprehensive content strategy that drives organic growth without the agency price tag.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Wand2 className="w-10 h-10 text-indigo-600 mb-4" />,
                  title: "Expert-Level Content",
                  desc: "Our AI researches hundreds of sources to write authoritative content that sounds human and expert."
                },
                {
                  icon: <Globe2 className="w-10 h-10 text-indigo-600 mb-4" />,
                  title: "SEO Native",
                  desc: "Built-in keyword research, internal linking, and technical optimization to dominate search results."
                },
                {
                  icon: <BarChart className="w-10 h-10 text-indigo-600 mb-4" />,
                  title: "Lead Generation",
                  desc: "Convert traffic with smart CTAs, lead magnets, and visitor identification."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-20">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
              <p className="text-muted-foreground">Start growing today. Cancel anytime.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Starter */}
              <div className="rounded-2xl border p-8 bg-background shadow-sm hover:border-indigo-200 transition-colors">
                <h3 className="font-semibold text-lg mb-2">Starter</h3>
                <div className="text-3xl font-bold mb-6">$49<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                <ul className="space-y-3 mb-8">
                  {["4 Articles / month", "Basic SEO", "English only", "Email Support"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register?plan=starter" className="block w-full py-2 px-4 bg-secondary text-secondary-foreground text-center rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
                  Get Started
                </Link>
              </div>

              {/* Growth */}
              <div className="rounded-2xl border-2 border-indigo-600 p-8 bg-background shadow-xl relative">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                  Popular
                </div>
                <h3 className="font-semibold text-lg mb-2">Growth</h3>
                <div className="text-3xl font-bold mb-6">$149<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                <ul className="space-y-3 mb-8">
                  {["15 Articles / month", "Advanced SEO Mode", "Multi-language", "Priority Support", "Lead Magnets"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-indigo-600" /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register?plan=growth" className="block w-full py-2 px-4 bg-indigo-600 text-white text-center rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Get Started
                </Link>
              </div>

              {/* Scale */}
              <div className="rounded-2xl border p-8 bg-background shadow-sm hover:border-indigo-200 transition-colors">
                <h3 className="font-semibold text-lg mb-2">Scale</h3>
                <div className="text-3xl font-bold mb-6">$399<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                <ul className="space-y-3 mb-8">
                  {["50 Articles / month", "Agency Features", "API Access", "Dedicated Success Manager"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register?plan=scale" className="block w-full py-2 px-4 bg-secondary text-secondary-foreground text-center rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
