"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/mockData";
import { useCart } from "@/context/CartContext";
import { trackAddToCart } from "@/lib/gtag";
import styles from "./AddToCartDetail.module.css";

interface AddToCartDetailProps {
  product: Product;
}

export default function AddToCartDetail({ product }: AddToCartDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, updateQty, items } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    // Agregamos tantas unidades como haya seleccionado el usuario
    const existing = items.find((i) => i.id === product.id);
    if (!existing) {
      addItem(product);
      if (quantity > 1) {
        updateQty(product.id, quantity);
      }
    } else {
      updateQty(product.id, existing.quantity + quantity);
    }

    trackAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/carrito");
  };

  return (
    <div className={styles.container}>
      <div className={styles.qtyRow}>
        <span className={styles.qtyLabel}>Cantidad:</span>
        <div className={styles.qtySelector}>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className={styles.qtyValue}>{quantity}</span>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>
        <span className={styles.stockInfo}>({product.stock} disponibles)</span>
      </div>

      <div className={styles.buttonsRow}>
        <button
          type="button"
          onClick={handleAddToCart}
          className={`btn btn-primary ${styles.actionBtn} ${justAdded ? styles.added : ""}`}
          disabled={product.stock <= 0}
        >
          {justAdded ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              ¡Agregado al Carrito!
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              Añadir al Carrito
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className={`btn btn-secondary ${styles.buyNowBtn}`}
          disabled={product.stock <= 0}
        >
          Comprar Ahora
        </button>
      </div>
    </div>
  );
}

