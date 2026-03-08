import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-primary/50 focus-visible:ring-[4px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "btn-primary text-sm font-semibold",
        primary:
          "btn-gradient-primary text-lg font-semibold shadow-lg transition-all duration-300 group",
        destructive:
          "btn-destructive hover:bg-destructive/20 text-sm font-semibold shadow-lg transition-all duration-300 group",
        outline:
          "border shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        outlineDestructive:
          "border shadow-xs text-primary-foreground bg-destructive hover:bg-destructive/80 hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        auth:
          "border-primary/30 bg-primary hover:bg-primary/80 text-primary-foreground text-lg font-semibold backdrop-blur-sm transition-all duration-300",
        hero:
          "btn-gradient-primary text-lg font-semibold shadow-lg transition-all duration-300 group",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "text-lg text-foreground hover:bg-secondary/50 hover:text-foreground",
        enable:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/80 shimmer",
        disable:
          "bg-primary/50 text-primary-foreground shadow-xs cursor-not-allowed",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "btn-gradient-primary",
        gradientSecondary: "btn-gradient-secondary",
      },
      size: {
        default: "h-11 px-6 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-full gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-full px-8 text-base has-[>svg]:px-5",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
