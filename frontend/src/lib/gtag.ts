/**
 * NexusHardware — Integración oficial con Google Analytics 4 (GA4) mediante gtag.js
 * Cumple con los requerimientos de la Asignatura: Desempeño de Sistemas (UTEM).
 * Soporta eventos estándar de e-commerce: view_item, add_to_cart, begin_checkout, purchase.
 */

import type { Product } from "./mockData";
import type { CartItem } from "@/context/CartContext";

export const GA_TRACKING_ID: string =
  process.env.NEXT_PUBLIC_GA_ID || "G-NEXUSHW2026";

/**
 * Registra una vista de página en Google Analytics 4
 */
export function pageview(url: string): void {
  try {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("config", GA_TRACKING_ID, {
        page_path: url,
      });
    }
  } catch {
    // Silencioso para prevenir cualquier fallo de ejecución en la UI
  }
}

/**
 * Dispara un evento personalizado genérico en Google Analytics 4
 */
export function event(action: string, params: Record<string, any> = {}): void {
  try {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", action, params);
    }
  } catch {
    // Silencioso
  }
}

/**
 * Evento GA4: view_item
 * Se dispara cuando el usuario visualiza la ficha de detalle de un producto.
 */
export function trackViewItem(product: Product): void {
  event("view_item", {
    currency: "CLP",
    value: product.price,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

/**
 * Evento GA4: add_to_cart
 * Se dispara cuando un producto es añadido al carrito de compras.
 */
export function trackAddToCart(product: Product, quantity = 1): void {
  event("add_to_cart", {
    currency: "CLP",
    value: product.price * quantity,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.category,
        price: product.price,
        quantity,
      },
    ],
  });
}

/**
 * Evento GA4: begin_checkout
 * Se dispara al iniciar el flujo de pago desde el carrito de compras.
 */
export function trackBeginCheckout(items: CartItem[], totalValue: number): void {
  event("begin_checkout", {
    currency: "CLP",
    value: totalValue,
    items: items.map((item) => ({
      item_id: String(item.id),
      item_name: item.name,
      item_brand: item.brand,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

/**
 * Evento GA4: purchase
 * Se dispara al completarse exitosamente una transacción en el checkout sandbox.
 */
export function trackPurchase(order: {
  id: number | string;
  total: number;
  items: Array<{
    id: number;
    name: string;
    brand?: string;
    category?: string;
    price: number;
    quantity: number;
  }>;
}): void {
  event("purchase", {
    transaction_id: String(order.id),
    currency: "CLP",
    value: order.total,
    shipping: 0,
    items: order.items.map((item) => ({
      item_id: String(item.id),
      item_name: item.name,
      item_brand: item.brand || "NexusHardware",
      item_category: item.category || "Componentes",
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

export default GA_TRACKING_ID;
