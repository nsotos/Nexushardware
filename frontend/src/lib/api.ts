/**
 * NexusHardware — Cliente API centralizado
 * Conecta con el backend Express (http://localhost:4000/api) y cuenta con fallback
 * automático a mockData en caso de que el backend no se encuentre en ejecución.
 */

import { products as mockProducts, categories as mockCategories, Product, Category } from "./mockData";

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
    const res = await fetch(url, { next: { revalidate: 30 } });

    if (!res.ok) {
      throw new Error(`Error en API: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      success: true,
      total: data.total ?? data.products?.length ?? 0,
      totalPages: data.totalPages ?? 1,
      currentPage: data.currentPage ?? 1,
      products: data.products ?? [],
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
    const res = await fetch(`${API_BASE_URL}/products/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Error al obtener producto");
    }
    const data = await res.json();
    return data.product || null;
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

