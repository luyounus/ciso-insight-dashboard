import "./globals.css";
import NavTabs from "@/components/layout/NavTabs";
import { Inter, Poppins } from "next/font/google";
import LivePulse from "@/components/common/LivePulse";
import RouteTransition from "@/components/common/RouteTransition";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} max-w-6xl mx-auto px-4 p-2.5 antialiased`}>
        <NavTabs />
        <RouteTransition>
          {children}
        </RouteTransition>
        <LivePulse />
      </body>
    </html>
  );
}
