import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
    const faqs = [
        {
            question: "Is my financial data secure and isolated?",
            answer: "Absolutely. CashFlo uses a strict per-user database isolation pattern. Your data is encrypted at rest and in transit, and the system design ensures users can strictly only access data associated with their own account or where they have been explicitly granted partner access."
        },
        {
            question: "How does the automated revenue sharing work?",
            answer: "When you add an asset, you can designate partners and assign them percentage shares. When revenue is recorded against that asset, the system automatically calculates the exact split distribution, entirely eliminating manual spreadsheet math."
        },
        {
            question: "Can I manage multiple companies or banks?",
            answer: "Yes, you can register unlimited entities (Companies) and financial institutions (Banks), and tie your specific assets and subsequent revenues/costs precisely to them for highly granular reporting."
        },
        {
            question: "Do I need to be an accountant to use this?",
            answer: "Not at all. The interface is designed to be as clear and intuitive as a consumer app, but it is engineered to handle the backend complexity of business operations."
        }
    ];

    return (
        <section id="faq" className="py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 fade-in">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Everything you need to know about scaling your operations with CashFlo.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full fade-in fade-in-delay-1">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-border/50">
                            <AccordionTrigger className="text-left font-semibold text-lg py-4 hover:text-primary transition-colors">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
