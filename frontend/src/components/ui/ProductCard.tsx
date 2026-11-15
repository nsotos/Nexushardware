"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, MouseEvent } from "react";
import { Product } from "@/lib/mockData";
import { useCart } from "@/context/CartContext";
import { trackAddToCart } from "@/lib/gtag";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

/**
 * Formatea un valor numérico a pesos chilenos (CLP)
 */
function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    trackAddToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const badgeClass =
    product.badge === "Nuevo"
      ? "badge-green"
      : product.badge === "Oferta"
      ? "badge-orange"
      : "badge-blue";

  return (
    <div className={styles.card}>
      <Link href={`/productos/${product.slug}`} className={styles.imageWrapper}>
        {product.badge && (
          <span className={`badge ${badgeClass} ${styles.badge}`}>
            {product.badge}
          </span>
        )}
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={300}
          className={styles.productImage}
          unoptimized
        />
      </Link>

      <div className={styles.content}>
        <span className={styles.brand}>{product.brand}</span>
        <Link href={`/productos/${product.slug}`}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>

        {product.rating > 0 && (
          <div className={styles.rating}>
            <span>★ {product.rating.toFixed(1)}</span>
            <span className={styles.reviewCount}>({product.reviews || 0})</span>
          </div>
        )}

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatCLP(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className={styles.originalPrice}>
              {formatCLP(product.originalPrice)}
            </span>
          )}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            onClick={handleAddToCart}
            className={`${styles.addButton} ${justAdded ? styles.added : ""}`}
            disabled={product.stock <= 0}
          >
            {justAdded ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                ¡Agregado!
              </>
            ) : product.stock > 0 ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Añadir al carrito
              </>
            ) : (
              "Agotado"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

