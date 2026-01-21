import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import SettingsPanel from "@/components/SettingsPanel";
import { ReadingProvider } from "../context/ReadingContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Just2Read | The Future of Healthy Digital Reading",
  description: "A premium, glassmorphism-styled reading application with advanced eye-care features.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReadingProvider>
          <Navigation />
          <SettingsPanel />
          <div className="main-content">
            {children}
          </div>
        </ReadingProvider>
      </body>
    </html>
  );
}
