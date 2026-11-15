/**
 * NexusHardware — Controlador de Productos, Categorías y Marcas
 * Gestiona consultas con filtros avanzados, búsqueda y paginación para la tienda.
 */

const prisma = require("../prisma/client");

/**
 * Genera especificaciones técnicas de hardware enriquecidas para la ficha de producto
 */
function getSpecsForProduct(product) {
  if (product.specs && typeof product.specs === "object" && Object.keys(product.specs).length > 0) {
    return product.specs;
  }
  const name = product.name || "";
  const cat = (product.category?.slug || product.category?.name || product.category || "").toLowerCase();

  if (cat.includes("grafica")) {
    return {
      "Memoria VRAM": name.includes("24GB") ? "24GB GDDR6X" : name.includes("16GB") ? "16GB GDDR6X" : name.includes("12GB") ? "12GB GDDR6X" : "8GB GDDR6",
      "Interfaz": "PCI Express 4.0 x16",
      "Conectores de Poder": name.includes("4080") || name.includes("4070") ? "1x 16-pin (12VHPWR)" : "2x 8-pin PCIe",
      "Refrigeración": "Ventiladores Axiales con modo 0dB silencioso",
      "Resolución Máxima": "7680 x 4320 (8K Ultra HD)",
      "Fuente Recomendada": name.includes("4080") || name.includes("7900") ? "850W 80 Plus Gold" : "650W 80 Plus Bronze",
    };
  }
  if (cat.includes("procesador")) {
    return {
      "Socket": name.includes("Ryzen") ? "AMD AM5" : "Intel LGA1700",
      "Arquitectura": name.includes("Ryzen") ? "Zen 4 (5nm FinFET)" : "Raptor Lake Refresh (Intel 7)",
      "Núcleos / Hilos": name.includes("14900") ? "24 Núcleos (8P + 16E) / 32 Hilos" : name.includes("7950") ? "16 Núcleos / 32 Hilos" : name.includes("14700") ? "20 Núcleos (8P + 12E) / 28 Hilos" : name.includes("7800X3D") ? "8 Núcleos / 16 Hilos" : "6 Núcleos / 12 Hilos",
      "Frecuencia Máxima": name.includes("14900") ? "Hasta 6.0 GHz Turbo" : name.includes("7950") ? "Hasta 5.7 GHz Turbo" : name.includes("14700") ? "Hasta 5.6 GHz Turbo" : "Hasta 5.0 GHz Turbo",
      "Caché": name.includes("X3D") ? "96MB 3D V-Cache (104MB Total)" : "33MB a 36MB L3",
      "TDP Base": name.includes("X3D") ? "120W" : name.includes("K") ? "125W (Max Turbo 253W)" : "105W",
    };
  }
  if (cat.includes("ram") || cat.includes("memoria")) {
    return {
      "Tipo de Memoria": name.includes("DDR5") ? "DDR5 DIMM 288-pin" : "DDR4 DIMM 288-pin",
      "Capacidad del Kit": name.includes("64GB") ? "64GB (2x32GB)" : name.includes("32GB") ? "32GB (2x16GB)" : "16GB (2x8GB)",
      "Velocidad": name.includes("6400") ? "6400 MHz" : name.includes("6000") ? "6000 MHz" : name.includes("5600") ? "5600 MHz" : "3600 MHz",
      "Latencia CAS": name.includes("DDR5") ? "CL30 / CL32" : "CL16",
      "Perfiles de Rendimiento": "Intel XMP 3.0 & AMD EXPO",
      "Voltaje Operativo": name.includes("DDR5") ? "1.35V - 1.40V" : "1.35V",
    };
  }
  if (cat.includes("ssd") || cat.includes("almacenamiento")) {
    return {
      "Factor de Forma": name.includes("SATA") ? "2.5 pulgadas (7mm)" : "M.2 2280",
      "Interfaz": name.includes("PCIe 5.0") ? "PCIe Gen 5.0 x2 / Gen 4.0 x4" : name.includes("SATA") ? "SATA III 6 Gb/s" : "PCIe Gen 4.0 x4, NVMe 2.0",
      "Velocidad de Lectura": name.includes("990 PRO") ? "Hasta 7.450 MB/s" : name.includes("KC3000") || name.includes("980 PRO") ? "Hasta 7.000 MB/s" : name.includes("SATA") ? "Hasta 560 MB/s" : "Hasta 5.000 MB/s",
      "Velocidad de Escritura": name.includes("990 PRO") ? "Hasta 6.900 MB/s" : name.includes("SATA") ? "Hasta 530 MB/s" : "Hasta 4.000 MB/s",
      "Durabilidad / TBW": name.includes("2TB") ? "1.200 TBW" : "600 TBW",
      "Cifrado de Seguridad": "AES 256-bit Hardware Encryption",
    };
  }
  if (cat.includes("placa") || cat.includes("madre")) {
    return {
      "Socket CPU": name.includes("AM5") || name.includes("B650") ? "AMD Socket AM5 (Ryzen 7000/8000/9000)" : "Intel LGA1700 (12va, 13va y 14va gen)",
      "Formato": name.includes("B760M") ? "Micro-ATX" : "ATX",
      "Slots de Memoria": "4x DDR5 DIMM (Hasta 192GB, 7200+ MHz OC)",
      "Ranuras M.2": name.includes("Z790") || name.includes("Hero") ? "4x M.2 PCIe 5.0/4.0" : "3x M.2 PCIe 4.0 x4",
      "Conectividad": "WiFi 6E / WiFi 7 + Bluetooth 5.3 + 2.5G LAN",
      "Audio": "ROG SupremeFX / Realtek ALC4080 7.1 Surround",
    };
  }
  if (cat.includes("fuente")) {
    return {
      "Potencia": name.includes("1000W") ? "1000 Watts Continuos" : name.includes("850W") ? "850 Watts Continuos" : "750 Watts Continuos",
      "Certificación": name.includes("Platinum") ? "80 PLUS Platinum (92%+ eficiencia)" : name.includes("Gold") ? "80 PLUS Gold (90%+ eficiencia)" : "80 PLUS Bronze (85%+)",
      "Modularidad": "100% Totalmente Modular con cables planos",
      "Estándar": name.includes("ATX 3") || name.includes("PCIE5") ? "ATX 3.0 / PCIe 5.0 con conector 12VHPWR 16-pin" : "ATX12V v2.52",
      "Ventilador": "135mm FDB con modo Zero RPM (silencioso)",
      "Protecciones": "OVP, UVP, SCP, OTP, OPP, OCP",
    };
  }
  if (cat.includes("gabinete")) {
    return {
      "Factor de Forma": "Mid-Tower (Compatible con ATX, Micro-ATX, Mini-ITX)",
      "Paneles": "Vidrio Templado Lateral de 4mm + Frontal de Alto Flujo",
      "Ventiladores Incluidos": name.includes("4000X") || name.includes("110R") ? "3x o 4x Ventiladores ARGB 120mm" : "2x Ventiladores AirGuide 120mm",
      "Soporte de Radiador": "Frontal hasta 360mm / Superior hasta 280mm / 360mm",
      "Longitud Máx. GPU": "Hasta 380mm (admite RTX 4090 / RX 7900 XTX)",
      "Puertos Frontales": "1x USB 3.2 Gen 2 Type-C, 2x USB 3.0, Jack Audio combo",
    };
  }
  if (cat.includes("refrigeracion")) {
    return {
      "Tipo de Refrigeración": "Líquida AIO (All-in-One) de Circuito Cerrado",
      "Tamaño del Radiador": name.includes("360") ? "360mm (397 x 120 x 27 mm)" : name.includes("240") ? "240mm (277 x 120 x 27 mm)" : "120mm compacto",
      "Ventiladores": "Ventiladores PWM ARGB con levitación magnética (hasta 2.100 RPM)",
      "Compatibilidad Sockets": "Intel LGA1700/1200/115x y AMD AM5/AM4",
      "Bomba": name.includes("LCD") || name.includes("Ryujin") ? "Bomba de alto flujo con pantalla LCD IPS integrada" : "Bomba de alta presión silenciosa <20 dBA",
      "Material del Bloque": "Cobre de microaletas con pasta térmica preaplicada",
    };
  }
  return {
    "Garantía": "24 meses oficial",
    "Compatibilidad": "Universal para componentes de computador",
    "Condición": "Nuevo en empaque sellado de fábrica",
  };
}

/**
 * Obtener listado de productos con paginación, filtros y ordenamiento
 * GET /api/products
 * Query params opcionales:
 * - page: número de página (defecto: 1)
 * - limit: cantidad por página (defecto: 10, máx: 50)
 * - category: slug de la categoría (ej: "tarjetas-graficas")
 * - brand: slug de la marca (ej: "asus")
 * - search: término de búsqueda en nombre o descripción
 * - minPrice / maxPrice: rango de precios
 * - sortBy: "price-asc" | "price-desc" | "name-asc" | "newest" (defecto)
 */
async function getProducts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const { category, brand, search, minPrice, maxPrice, sortBy } = req.query;

    // Construcción dinámica de filtros WHERE
    const where = {};

    if (category) {
      where.category = { slug: String(category).toLowerCase() };
    }

    if (brand) {
      where.brand = { slug: String(brand).toLowerCase() };
    }

    if (search) {
      const searchTerm = String(search).trim();
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        where.price.gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        where.price.lte = Number(maxPrice);
      }
    }

    // Ordenamiento
    let orderBy = { createdAt: "desc" };
    if (sortBy === "price-asc") orderBy = { price: "asc" };
    if (sortBy === "price-desc") orderBy = { price: "desc" };
    if (sortBy === "name-asc") orderBy = { name: "asc" };

    // Ejecución en paralelo del conteo total y los productos
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true, logoUrl: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    // Enriquecemos cada producto con sus specs manteniendo objetos brand y category completos
    const enrichedProducts = products.map((p) => ({
      ...p,
      brand: p.brand ?? null,
      category: p.category ?? null,
      specs: getSpecsForProduct(p),
      rating: p.rating ?? 4.8,
      reviews: p.reviews ?? 16,
    }));

    res.json({
      success: true,
      data: enrichedProducts,
      products: enrichedProducts,
      total,
      totalPages,
      currentPage: page,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtener un producto por su slug
 * GET /api/products/:slug
 */
async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
        message: `No existe ningún producto con el slug '${slug}'`,
      });
    }

    const enriched = {
      ...product,
      brand: product.brand?.name || product.brand || "",
      category: product.category?.name || product.category || "",
      specs: getSpecsForProduct(product),
      rating: product.rating ?? 4.9,
      reviews: product.reviews ?? 18,
    };

    res.json({
      success: true,
      data: enriched,
      product: enriched,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtener listado de todas las categorías con el conteo de productos
 * GET /api/categories
 */
async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      productCount: c._count.products,
    }));

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtener listado de todas las marcas con el conteo de productos
 * GET /api/brands
 */
async function getBrands(req, res, next) {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const formatted = brands.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      logoUrl: b.logoUrl,
      productCount: b._count.products,
    }));

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProductBySlug,
  getCategories,
  getBrands,
};
