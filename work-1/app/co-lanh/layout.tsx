import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Từ Điển Cô Lành",
  description: "Tra cứu từ vựng tiếng Anh với giải thích chi tiết",
};

export default function CoLanhLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
