import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Magnus Lemme - Portfolio",
  description: "Full-Stack Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
