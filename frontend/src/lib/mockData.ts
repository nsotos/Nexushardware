/**
 * NexusHardware — Datos de ejemplo (mock)
 * Usados mientras la API real no está conectada.
 * Reemplazar con llamadas reales a /api/products cuando el backend esté listo.
 */

export interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating: number;
  reviews: number;
  stock: number;
  badge?: string;
  specs: Record<string, string>;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

// ─── Categorías ──────────────────────────────────────────────────────────────
export const categories: Category[] = [
  { id: 1, name: "Tarjetas Gráficas", slug: "tarjetas-graficas", icon: "🎮", count: 24 },
  { id: 2, name: "Procesadores",      slug: "procesadores",      icon: "⚡", count: 18 },
  { id: 3, name: "Memoria RAM",       slug: "memoria-ram",       icon: "💾", count: 30 },
  { id: 4, name: "Almacenamiento",    slug: "almacenamiento",    icon: "💿", count: 22 },
  { id: 5, name: "Tarjetas Madre",    slug: "tarjetas-madre",    icon: "🔧", count: 15 },
  { id: 6, name: "Fuentes de Poder",  slug: "fuentes-poder",     icon: "🔌", count: 12 },
];

// ─── Productos ────────────────────────────────────────────────────────────────
export const products: Product[] = [
  {
    id: 1,
    name: "NVIDIA GeForce RTX 5090",
    slug: "nvidia-rtx-5090",
    brand: "NVIDIA",
    category: "tarjetas-graficas",
    price: 2199990,
    imageUrl: "https://placehold.co/400x300/0a0a1a/00ff88?text=RTX+5090",
    rating: 4.9,
    reviews: 128,
    stock: 5,
    badge: "Nuevo",
    description: "La tarjeta gráfica más poderosa del mundo. 32 GB GDDR7, arquitectura Blackwell.",
    specs: { VRAM: "32 GB GDDR7", "TDP": "600W", "Bus": "512-bit", "CUDA Cores": "21760" },
  },
  {
    id: 2,
    name: "ASUS ROG Strix RTX 4090 OC",
    slug: "asus-rog-rtx-4090-oc",
    brand: "ASUS",
    category: "tarjetas-graficas",
    price: 1499990,
    originalPrice: 1799990,
    imageUrl: "https://placehold.co/400x300/0a0a1a/4d9fff?text=RTX+4090",
    rating: 4.8,
    reviews: 214,
    stock: 8,
    badge: "Oferta",
    description: "Diseño ROG con triple ventilador, overclock de fábrica y RGB Aura Sync.",
    specs: { VRAM: "24 GB GDDR6X", "TDP": "450W", "Bus": "384-bit", "CUDA Cores": "16384" },
  },
  {
    id: 3,
    name: "AMD Ryzen 9 9950X",
    slug: "amd-ryzen-9-9950x",
    brand: "AMD",
    category: "procesadores",
    price: 649990,
    imageUrl: "https://placehold.co/400x300/0a0a1a/ff6b35?text=Ryzen+9",
    rating: 4.9,
    reviews: 95,
    stock: 12,
    badge: "Top Ventas",
    description: "16 núcleos, 32 hilos. Arquitectura Zen 5. El más rápido de su generación.",
    specs: { Núcleos: "16", Hilos: "32", "Boost": "5.7 GHz", TDP: "170W" },
  },
  {
    id: 4,
    name: "Intel Core i9-14900K",
    slug: "intel-core-i9-14900k",
    brand: "Intel",
    category: "procesadores",
    price: 499990,
    originalPrice: 579990,
    imageUrl: "https://placehold.co/400x300/0a0a1a/0066ff?text=i9-14900K",
    rating: 4.7,
    reviews: 177,
    stock: 20,
    description: "24 núcleos (8P+16E), boost hasta 6.0 GHz. El rey del gaming y productividad.",
    specs: { Núcleos: "24", Hilos: "32", "Boost": "6.0 GHz", TDP: "125W" },
  },
  {
    id: 5,
    name: "Kingston Fury Beast DDR5 32GB 6000MHz",
    slug: "kingston-fury-beast-ddr5-32gb",
    brand: "Kingston",
    category: "memoria-ram",
    price: 129990,
    imageUrl: "https://placehold.co/400x300/0a0a1a/00ff88?text=DDR5+32GB",
    rating: 4.8,
    reviews: 312,
    stock: 45,
    badge: "Más Vendido",
    description: "Kit 2x16 GB DDR5 6000 MHz con disipador de aluminio y XMP 3.0.",
    specs: { Capacidad: "32 GB (2x16)", Velocidad: "6000 MHz", Tipo: "DDR5", Latencia: "CL36" },
  },
  {
    id: 6,
    name: "Corsair Vengeance DDR5 64GB 5600MHz",
    slug: "corsair-vengeance-ddr5-64gb",
    brand: "Corsair",
    category: "memoria-ram",
    price: 219990,
    imageUrl: "https://placehold.co/400x300/0a0a1a/4d9fff?text=DDR5+64GB",
    rating: 4.7,
    reviews: 88,
    stock: 18,
    description: "Kit 2x32 GB DDR5 para workstations y creadores de contenido.",
    specs: { Capacidad: "64 GB (2x32)", Velocidad: "5600 MHz", Tipo: "DDR5", Latencia: "CL40" },
  },
  {
    id: 7,
    name: "Samsung 990 Pro 2TB NVMe PCIe 4.0",
    slug: "samsung-990-pro-2tb",
    brand: "Samsung",
    category: "almacenamiento",
    price: 179990,
    originalPrice: 209990,
    imageUrl: "https://placehold.co/400x300/0a0a1a/ff6b35?text=SSD+2TB",
    rating: 4.9,
    reviews: 421,
    stock: 30,
    badge: "Oferta",
    description: "SSD NVMe M.2 con velocidades de hasta 7450 MB/s lectura. Ideal para gaming.",
    specs: { Capacidad: "2 TB", Lectura: "7450 MB/s", Escritura: "6900 MB/s", Interfaz: "PCIe 4.0 x4" },
  },
  {
    id: 8,
    name: "ASUS ROG Maximus Z790 Hero",
    slug: "asus-rog-maximus-z790-hero",
    brand: "ASUS",
    category: "tarjetas-madre",
    price: 699990,
    imageUrl: "https://placehold.co/400x300/0a0a1a/00ff88?text=Z790+Hero",
    rating: 4.8,
    reviews: 63,
    stock: 7,
    description: "Placa madre flagship para Intel 13a/14a gen. Fases de potencia 24+1.",
    specs: { Socket: "LGA1700", Chipset: "Z790", RAM: "DDR5 7200+ MHz", Formato: "ATX" },
  },
];

// ─── Marcas destacadas ────────────────────────────────────────────────────────
export const brands = ["NVIDIA", "AMD", "ASUS", "MSI", "Kingston", "Corsair", "Intel", "Samsung"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Retorna todos los productos de una categoría */
export const getByCategory = (slug: string) =>
  products.filter((p) => p.category === slug);

/** Retorna un producto por su slug */
export const getBySlug = (slug: string) =>
  products.find((p) => p.slug === slug) ?? null;

/** Formatea precio en CLP */
export const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(price);
