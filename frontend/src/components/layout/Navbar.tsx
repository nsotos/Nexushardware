"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const { totalItems } = useCart();
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/productos");
    }
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </span>
          <span>NEXUS<span className={styles.logoHighlight}>HARDWARE</span></span>
        </Link>

        {/* Formulario de búsqueda */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <span className={styles.searchIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar tarjetas gráficas, procesadores, RAM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Enlaces de navegación */}
        <nav>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/" className={styles.navLink}>
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/productos" className={styles.navLink}>
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/#categorias" className={styles.navLink}>
                Categorías
              </Link>
            </li>
            <li>
              <Link href="/productos?ofertas=true" className={styles.navLink}>
                Ofertas
              </Link>
            </li>
          </ul>
        </nav>

        {/* Acciones: Carrito de compras */}
        <div className={styles.actions}>
          <Link href="/carrito" className={styles.cartButton} aria-label="Ver carrito de compras">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems > 99 ? "99+" : totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

