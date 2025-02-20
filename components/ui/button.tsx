import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-darkGray disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-paleBlue text-white font-bold shadow hover:bg-paleBlue/90",
        destructive:
          "bg-lightPink text-darkGray shadow-sm hover:bg-lightPink/90",
        outline:
          "border border-lavender bg-transparent shadow-sm hover:bg-lavender hover:text-darkGray",
        secondary: "bg-peach text-darkGray shadow-sm hover:bg-darkGray/95",
        tertiary: "bg-white text-black shadow-sm",
        ghost: "bg-transparent hover:bg-lavender hover:text-darkGray",
        link: "text-paleYellow underline-offset-4 hover:underline",
        purple:
          "bg-lavender text-white font-bold shadow-sm hover:bg-lavender/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
