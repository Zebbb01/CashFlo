import Link from "next/link";
import { Zap, Twitter, Github, Linkedin } from "lucide-react";

export function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background border-t border-border pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-12">

                    {/* Brand Info */}
                    <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center transition-transform group-hover:scale-105">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                                CashFlo
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                            Engineering financial success through crystal-clear data visualization,
                            powerful tracking, and automated insights.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Twitter">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="GitHub">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="LinkedIn">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="font-semibold text-foreground mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li><Link href="#features" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Features</Link></li>
                            <li><Link href="#how-it-works" className="text-muted-foreground hover:text-foreground text-sm transition-colors">How It Works</Link></li>
                            <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="font-semibold text-foreground mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li><Link href="#faq" className="text-muted-foreground hover:text-foreground text-sm transition-colors">FAQ</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Blog</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Community</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Cookie Policy</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Security</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                    <p className="text-muted-foreground text-sm">
                        &copy; {currentYear} CashFlo Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Built for scale. Designed for humans.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
