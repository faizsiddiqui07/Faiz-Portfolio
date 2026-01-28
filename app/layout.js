import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const baseUrl = "https://faizsiddiqui.netlify.app"; 

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Faiz Siddiqui | Senior Software Engineer & MERN Stack Developer",
    template: "%s | Faiz Siddiqui",
  },
  description:
    "Portfolio of Faiz Siddiqui, a Software Engineer with 3+ years of experience in MERN Stack, Next.js, React, and scalable web architecture based in Lucknow.",
  keywords: [
    "Faiz Siddiqui",
    "Faiz Siddiqui Developer",
    "Faiz Siddiqui Portfolio",
    "MERN Stack Developer",
    "Next.js Expert",
    "React Developer Lucknow",
    "Software Engineer India",
    "Web Developer Portfolio",
  ],
  verification: {
    google: "qgdgC_GOTrDY-mZtYqGV3EMUkb7cvDwdbf_IlmfKq",
  },
  authors: [{ name: "Faiz Siddiqui" }],
  creator: "Faiz Siddiqui",
  openGraph: {
    title: "Faiz Siddiqui | Building the Future with Code",
    description:
      "Explore the portfolio of Faiz Siddiqui - 3+ Years Exp. in React, Node.js & Next.js.",
    url: baseUrl,
    siteName: "Faiz Siddiqui",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
