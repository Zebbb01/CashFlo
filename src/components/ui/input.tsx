import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/10 bg-background/50 backdrop-blur-md border-input/50 flex h-11 w-full min-w-0 rounded-xl border px-4 py-2 text-base shadow-sm transition-[color,box-shadow,border-color] duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:border-primary/40",
        "focus-visible:border-primary/50 focus-visible:ring-primary/30 focus-visible:ring-[4px] focus-visible:bg-background",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
