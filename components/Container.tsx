import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    // <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-6 px-4 py-3">
    //   {children}
    // </div>
    <div className={cn(" p-4 md:p-6 space-y-6", className)}>{children}</div>
  );
}
