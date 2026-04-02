import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { cookies } from 'next/headers'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cobranza Despacho - Sistema de Gestión",
  description: "Control de facturación y cobranza para despachos jurídicos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  const userRole = session?.value

  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar userRole={userRole} />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
