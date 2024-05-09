import "./globals.css";
import { Archivo } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";

const firaMono = Archivo({
  subsets: ["latin"],
  weight: "400",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "State of Health",
  description: "Monitor your life with State of Health",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main
          className={`${firaMono.className} min-h-screen flex flex-col items-center`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
