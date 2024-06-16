import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { cn } from "@/utils";


export const metadata: Metadata = {
  title: "Utopia Express",
  description: "Voice Assistant by Utopia Express",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex flex-col min-h-screen bg-fixed bg-gradient-to-tl from-red-100 to-slate-300"
        )}
      >
        <Nav />
        {children}
      </body>
    </html>

  );
}
