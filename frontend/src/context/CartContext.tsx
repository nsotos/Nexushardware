"use client";
/**
 * NexusHardware — Contexto global del carrito de compras
 * Maneja el estado del carrito usando React Context + localStorage para persistencia.
 */

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import type { Product } from "@/lib/mockData";

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM";    payload: Product }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QTY";  payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART";   payload: CartItem[] };

interface CartContextValue {
  items:       CartItem[];
  totalItems:  number;
  totalPrice:  number;
  addItem:     (product: Product) => void;
  removeItem:  (id: number) => void;
  updateQty:   (id: number, quantity: number) => void;
  clearCart:   () => void;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.payload) };
    case "UPDATE_QTY":
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    case "LOAD_CART":
      return { items: action.payload };
    default:
      return state;
  }
}

// ─── Contexto ─────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexus_cart");
      if (saved) dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
    } catch {}
  }, []);

  // Persistir carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("nexus_cart", JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items:      state.items,
        totalItems,
        totalPrice,
        addItem:    (product) => dispatch({ type: "ADD_ITEM",    payload: product }),
        removeItem: (id)      => dispatch({ type: "REMOVE_ITEM", payload: id }),
        updateQty:  (id, qty) => dispatch({ type: "UPDATE_QTY",  payload: { id, quantity: qty } }),
        clearCart:  ()        => dispatch({ type: "CLEAR_CART" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/** Hook para consumir el contexto del carrito */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
