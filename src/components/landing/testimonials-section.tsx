import { Star } from "lucide-react";

export function TestimonialsSection() {
    const testimonials = [
        {
            content: "Before CashFlo, tracking our asset ROI was a nightmare of spreadsheets. Now, we see exactly where every peso comes from and where it goes. It's completely transformed how we scale.",
            author: "Maria Santos",
            role: "Operations Director, Vertex Holdings",
            image: "https://i.pravatar.cc/150?u=maria"
        },
        {
            content: "The automated revenue share calculating feature alone saves my finance team 15 hours a month. It handles all our complex partnership models flawlessly.",
            author: "David Chen",
            role: "Managing Partner, Alpine Ventures",
            image: "https://i.pravatar.cc/150?u=david"
        },
        {
            content: "We finally have clarity on true net margins. The UI is gorgeous, but the real value is the absolute precision in data isolation and reporting. Best financial tool we've added this year.",
            author: "Elena Rodriguez",
            role: "CEO, Nexa Group",
            image: "https://i.pravatar.cc/150?u=elena"
        }
    ];

    return (
        <section id="proof" className="py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16 fade-in">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                        Trusted by Leaders Managing Complexity
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Don't just take our word for it. See how modern financial operations are scaling with CashFlo.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="glass-card p-8 rounded-2xl flex flex-col h-full scale-hover fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                ))}
                            </div>
                            <blockquote className="flex-grow text-foreground text-lg mb-8 leading-relaxed">
                                "{t.content}"
                            </blockquote>
                            <div className="flex items-center gap-4 mt-auto">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full border-2 border-primary/20" />
                                <div>
                                    <div className="font-semibold text-foreground">{t.author}</div>
                                    <div className="text-sm text-muted-foreground">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
