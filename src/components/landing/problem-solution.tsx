import { BarChart3, TrendingUp, ShieldCheck, Zap } from "lucide-react";

export function ProblemSolutionSection() {
    const painPoints = [
        {
            title: "Scattered Spreadsheets",
            description: "Hours wasted each week reconciling data across disconnected platforms and manual exports.",
            icon: BarChart3,
        },
        {
            title: "Unclear Profitability",
            description: "Guessing actual margins because direct and indirect costs aren't properly attributed to revenue.",
            icon: TrendingUp,
        },
        {
            title: "Partnership Confusion",
            description: "Complex revenue sharing agreements leading to payout disputes and manual calculation errors.",
            icon: ShieldCheck,
        },
    ];

    return (
        <section id="how-it-works" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Problem */}
                <div className="text-center max-w-3xl mx-auto mb-16 fade-in">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
                        Stop Guessing Your Numbers. <br />
                        <span className="text-gradient-accent">Start Engineering Revenue.</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        The biggest bottleneck to scaling isn't acquisition. It's financial opacity.
                        When you can't clearly see which assets are driving true net profit, you freeze growth.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {painPoints.map((point, i) => (
                        <div key={i} className="glass-card p-8 rounded-2xl relative overflow-hidden group scale-hover fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <point.icon className="w-24 h-24" />
                            </div>
                            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-6 text-foreground">
                                <point.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{point.title}</h3>
                            <p className="text-muted-foreground">{point.description}</p>
                        </div>
                    ))}
                </div>

                {/* Solution */}
                <div className="relative rounded-3xl overflow-hidden glass-card border border-border/50 p-8 md:p-12 fade-in">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none" />
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                                <Zap className="w-4 h-4" /> The Solution
                            </div>
                            <h3 className="text-3xl font-bold mb-6">
                                One unified dashboard for absolute financial clarity.
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "Automated per-user data isolation.",
                                    "Real-time profit & loss tracking.",
                                    "Automated partner revenue share distributions.",
                                    "Bank-level security and data encryption."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                        <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-border/50 shadow-2xl">
                            {/* Replace with actual dashboard mockup image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                <p className="text-slate-500 font-medium">Dashboard Interface View</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
