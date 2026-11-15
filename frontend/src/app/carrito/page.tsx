"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import styles from "./carrito.module.css";

function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQty, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className={`container ${styles.cartPage}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p>Aún no has agregado componentes. Explora nuestro catálogo y potencia tu setup.</p>
          <Link href="/#catalogo" className="btn btn-primary">
            Explorar Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.cartPage}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Carrito de Compras</h1>
        <p className={styles.subtitle}>
          Tienes {totalItems} {totalItems === 1 ? "artículo" : "artículos"} en tu orden
        </p>
      </div>

      <div className={styles.cartLayout}>
        {/* Lista de Artículos */}
        <div className={styles.itemList}>
          {items.map((item) => (
            <div key={item.id} className={styles.itemCard}>
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={90}
                height={90}
                className={styles.itemImage}
                unoptimized
              />
              <div className={styles.itemInfo}>
                <span className={styles.itemBrand}>{item.brand}</span>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemPrice}>{formatCLP(item.price)}</span>
              </div>

              {/* Controles de Cantidad */}
              <div className={styles.qtyControls}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <span className={styles.qtyNumber}>{item.quantity}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              {/* Botón Eliminar */}
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeItem(item.id)}
                title="Eliminar producto"
                aria-label="Eliminar producto"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Resumen de Compra */}
        <aside className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>Resumen del Pedido</h2>

          <div className={styles.summaryRow}>
            <span>Subtotal ({totalItems} items)</span>
            <span>{formatCLP(totalPrice)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Despacho</span>
            <span className={styles.freeShipping}>Gratis</span>
          </div>

          <div className={styles.totalRow}>
            <span>Total</span>
            <span className={styles.totalPrice}>{formatCLP(totalPrice)}</span>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-full"
            onClick={() => alert("Flujo de Checkout Sandbox: Redirigiendo a pasarela de pago simulada...")}
          >
            Proceder al Checkout (Sandbox)
          </button>

          <Link href="/#catalogo" className="btn btn-secondary btn-full">
            Seguir Comprando
          </Link>

          <button type="button" className={styles.clearBtn} onClick={clearCart}>
            Vaciar Carrito
          </button>
        </aside>
      </div>
    </div>
  );
}

