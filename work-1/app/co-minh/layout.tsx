import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cô Minh English Chatbot",
  description: "Chatbot học tiếng Anh vui nhộn với Cô Minh",
};

export default function CoMinhLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
