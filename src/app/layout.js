import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GC Nova Batista",
  description: "GC é lugar de crescimento, amizade e cuidado, tudo isso com muito diálogo e coração aberto, e aquela comunhão que todo crente adora.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <div
        className="font-sans min-h-screen w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12 2xl:w-8/12 max-w-[1200px] m-auto py-8 sm:py-12">
        {children}

        <Analytics />
      </div>
      </body>
    </html>
  );
}
