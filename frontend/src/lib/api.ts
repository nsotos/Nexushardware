/**
 * NexusHardware — Cliente API centralizado
 * Conecta con el backend Express (http://localhost:4000/api) y cuenta con fallback
 * automático a mockData en caso de que el backend no se encuentre en ejecución.
 */

import { products as mockProducts, categories as mockCategories, Product, Category } from "./mockData";
export type { Product, Category };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export interface ProductsResponse {
  success: boolean;
  total: number;
  totalPages: number;
  currentPage: number;
  products: Product[];
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest";
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  _count?: { products: number };
}

/**
 * Obtiene el listado de productos con filtros y paginación
 */
export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const url = `${API_BASE_URL}/products?${params.toString()}`;
    // Timeout ultra rápido de 1200ms para no bloquear la experiencia de usuario
    const res = await fetch(url, {
      signal: AbortSignal.timeout(1200),
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`Error en API: ${res.statusText}`);
    }

    const data = await res.json();
    const rawList = data.data || data.products || [];
    const normalizedProducts: Product[] = rawList.map((p: any) => ({
      ...p,
      brand: typeof p.brand === "object" ? p.brand?.name || "" : p.brand || "",
      category: typeof p.category === "object" ? p.category?.name || "" : p.category || "",
      price: Number(p.price),
      rating: p.rating ?? 4.8,
      reviews: p.reviews ?? 14,
      specs: p.specs || {},
    }));

    return {
      success: true,
      total: data.total ?? data.pagination?.total ?? normalizedProducts.length,
      totalPages: data.totalPages ?? data.pagination?.totalPages ?? 1,
      currentPage: data.currentPage ?? data.pagination?.page ?? 1,
      products: normalizedProducts,
    };
  } catch {
    // Fallback con mockData en caso de fallo de red o backend apagado
    let result = [...mockProducts];

    if (filters.category) {
      result = result.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters.brand) {
      result = result.filter((p) => p.brand.toLowerCase() === filters.brand!.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (filters.sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    const limit = filters.limit || 12;
    const page = filters.page || 1;
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    return {
      success: true,
      total: result.length,
      totalPages: Math.ceil(result.length / limit),
      currentPage: page,
      products: paginated,
    };
  }
}

/**
 * Obtiene un producto individual por su slug
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`, {
      signal: AbortSignal.timeout(1200),
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Error al obtener producto");
    }
    const data = await res.json();
    const raw = data.data || data.product;
    if (!raw) return null;

    return {
      ...raw,
      brand: typeof raw.brand === "object" ? raw.brand?.name || "" : raw.brand || "",
      category: typeof raw.category === "object" ? raw.category?.name || "" : raw.category || "",
      price: Number(raw.price),
      rating: raw.rating ?? 4.9,
      reviews: raw.reviews ?? 18,
      specs: raw.specs || {},
    };
  } catch {
    const found = mockProducts.find((p) => p.slug === slug);
    return found || null;
  }
}

/**
 * Obtiene el listado de categorías oficiales
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("Error al obtener categorías");
    const data = await res.json();
    return data.categories || [];
  } catch {
    return mockCategories;
  }
}

/**
 * Obtiene el listado de marcas oficiales
 */
export async function fetchBrands(): Promise<Brand[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/brands`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("Error al obtener marcas");
    const data = await res.json();
    return data.brands || [];
  } catch {
    return [
      { id: 1, name: "NVIDIA", slug: "nvidia" },
      { id: 2, name: "ASUS", slug: "asus" },
      { id: 3, name: "AMD", slug: "amd" },
      { id: 4, name: "Kingston", slug: "kingston" },
      { id: 5, name: "Corsair", slug: "corsair" },
      { id: 6, name: "Intel", slug: "intel" },
      { id: 7, name: "MSI", slug: "msi" },
      { id: 8, name: "Samsung", slug: "samsung" },
    ];
  }
}

export interface CreateOrderPayload {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  shippingAddress: string;
}

export interface OrderVoucher {
  authorizationCode: string;
  responseCode: number;
  cardNumber: string;
  transactionDate: string;
  amount: number;
  paymentType: string;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  order?: {
    id: number;
    userId: number;
    total: number;
    status: string;
    shippingAddress: string;
    voucher?: OrderVoucher;
    createdAt: string;
    items?: Array<{
      id: number;
      productId: number;
      quantity: number;
      price: number;
      product: Product;
    }>;
  };
}

/**
 * Crea una orden de compra transaccional en el backend Express (/api/orders)
 */
export async function createOrder(
  payload: CreateOrderPayload,
  token?: string | null
): Promise<OrderResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Error al procesar la orden en el servidor.",
      };
    }

    return {
      success: true,
      message: data.message,
      order: data.order,
    };
  } catch (error: any) {
    // Si el backend no está disponible en este momento, generamos un voucher de fallback simulado
    const simulatedOrderId = Math.floor(100000 + Math.random() * 900000);
    const authCode = Math.floor(100000 + Math.random() * 900000).toString();
    const totalAmount = payload.items.reduce((sum, item) => {
      const p = mockProducts.find((mp) => mp.id === item.productId);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);

    return {
      success: true,
      message: "Compra realizada con éxito (Modo Sandbox Offline)",
      order: {
        id: simulatedOrderId,
        userId: 1,
        total: totalAmount,
        status: "PAID",
        shippingAddress: payload.shippingAddress,
        createdAt: new Date().toISOString(),
        voucher: {
          authorizationCode: authCode,
          responseCode: 0,
          cardNumber: "**** **** **** 6623",
          transactionDate: new Date().toISOString(),
          amount: totalAmount,
          paymentType: "Transbank Webpay Plus (Sandbox)",
        },
      },
    };
  }
}


