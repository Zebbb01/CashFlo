"use client";

import { useEffect, useState, useRef } from 'react';

export function StatsSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const stats = [
        { value: "₱250M+", label: "Assets Managed" },
        { value: "4.9/5", label: "User Rating" },
        { value: "99.9%", label: "Uptime SLA" },
        { value: "Zero", label: "Manual Calculations" },
    ];

    return (
        <section ref={sectionRef} className="py-20 bg-foreground text-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-y border-background/10 py-12">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                            style={{ transitionDelay: `${i * 150}ms` }}
                        >
                            <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm md:text-base font-medium text-background/70">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
