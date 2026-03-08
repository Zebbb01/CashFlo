import * as React from "react"
import { cn } from "@/lib/utils"

export interface CurrencyInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    currencySymbol?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ className, currencySymbol = "₱", ...props }, ref) => {
        return (
            <div className={cn("relative flex items-center w-full", className)}>
                <span className="absolute left-3 text-muted-foreground font-medium pointer-events-none">
                    {currencySymbol}
                </span>
                <input
                    type="number"
                    className={
                        "flex h-11 w-full rounded-xl border border-input/50 bg-background/50 backdrop-blur-md pl-10 pr-4 py-2 text-base shadow-sm transition-[color,box-shadow,border-color] duration-300 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:bg-background hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    }
                    ref={ref}
                    step="0.01" // Standard for currency
                    min="0"
                    {...props}
                />
            </div>
        )
    }
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
