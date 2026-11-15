import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusHardware | Componentes de Computador de Alto Rendimiento",
  description: "E-commerce de componentes de computador: tarjetas gráficas, procesadores, memorias RAM y almacenamiento de marcas oficiales como ASUS, NVIDIA, AMD, Corsair y más.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
