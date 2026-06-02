import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-soft hover:shadow-[0_6px_24px_-4px_rgba(93,112,82,0.25)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full",
        outline:
          "border-2 border-secondary text-secondary hover:bg-secondary/10 rounded-full",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full",
        ghost:
          "text-primary hover:bg-primary/10 rounded-full",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8 py-2",
        sm: "h-10 px-6 py-2",
        lg: "h-14 px-10 py-3 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export { buttonVariants };
