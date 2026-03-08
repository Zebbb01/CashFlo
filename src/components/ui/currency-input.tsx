import * as React from "react"
import { cn } from "@/lib/utils"

export interface CurrencyInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    currencySymbol?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ className, currencySymbol = "₱", ...props }, ref) => {
        return (
            <div className="relative flex items-center">
                <span className="absolute left-3 text-muted-foreground font-medium pointer-events-none">
                    {currencySymbol}
                </span>
                <input
                    type="number"
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        // Hide the default browser spin buttons for numbers
                        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                        className
                    )}
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
