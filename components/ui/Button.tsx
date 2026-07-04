import type { ComponentProps, ReactNode } from "react";

type ButtonBaseProps = {
  children: ReactNode;
  className?: string;
};

const baseClass =
  "inline-flex items-center gap-2 rounded-sm border border-hairline px-5 py-3 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-300 hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function Button({
  children,
  className = "",
  ...rest
}: ButtonBaseProps & ComponentProps<"button">) {
  return (
    <button className={`${baseClass} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  className = "",
  ...rest
}: ButtonBaseProps & ComponentProps<"a">) {
  return (
    <a className={`${baseClass} ${className}`} {...rest}>
      {children}
    </a>
  );
}
