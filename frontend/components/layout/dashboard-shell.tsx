import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function DashboardShell({
  children,
}: Props) {

  return (
    <main
      className="
        relative min-h-screen
        overflow-hidden
        bg-[#050816]
        text-white
      "
    >
      <div
        className="
          absolute left-1/2 top-0
          h-[500px] w-[500px]
          -translate-x-1/2
          rounded-full
          bg-violet-600/20
          blur-[120px]
        "
      />
      <div
        className="
          absolute bottom-0 right-0
          h-[400px] w-[400px]
          rounded-full
          bg-cyan-500/10
          blur-[120px]
        "
      />
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}