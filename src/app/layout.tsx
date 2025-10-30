import "./globals.css";
import NavTabs from "@/components/layout/NavTabs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="max-w-6xl mx-auto px-4 p-2.5">
        <NavTabs />
        {children}
      </body>
    </html>
  );
}
