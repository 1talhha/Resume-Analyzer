import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Resume Analyzer",
  description: "Powered by Groq and Llama 3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased min-h-screen selection:bg-blue-500/30`}>
        {children}
        <Toaster position="bottom-center" toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }} />
      </body>
    </html>
  );
}
