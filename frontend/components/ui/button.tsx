import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_48px_rgba(16,185,129,0.2)] hover:-translate-y-0.5 hover:bg-emerald-50',
        secondary:
          'border border-white/10 bg-white/5 text-white backdrop-blur-xl hover:border-emerald-400/40 hover:bg-white/10',
        ghost: 'text-zinc-300 hover:bg-white/5 hover:text-white',
        outline:
          'border border-white/15 bg-transparent text-white hover:border-white/30 hover:bg-white/5',
        danger: 'bg-rose-500 text-white hover:bg-rose-400',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-5',
        lg: 'h-12 px-6 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, type = 'button', asChild, children, ...props },
    ref
  ) => {
    const sharedClassName = cn(buttonVariants({ variant, size }), className);

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<{ className?: string }>,
        {
          className: cn(
            sharedClassName,
            (children.props as { className?: string }).className
          ),
        }
      );
    }

    return (
      <button ref={ref} type={type} className={sharedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
