/**
 * NexusHardware — Controlador de Productos, Categorías y Marcas
 * Gestiona consultas con filtros avanzados, búsqueda y paginación para la tienda.
 */

const prisma = require("../prisma/client");

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

    res.json({
      success: true,
      data: products,
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

    res.json({
      success: true,
      data: product,
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
