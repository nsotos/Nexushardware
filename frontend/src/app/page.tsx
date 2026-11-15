import Link from "next/link";
import { fetchProducts, fetchCategories, fetchBrands } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import CategoryCard from "@/components/ui/CategoryCard";
import styles from "./page.module.css";

export default async function HomePage() {
  // Obtenemos los productos destacados y categorías (con fallback automático a mockData)
  const [productsData, categories, brands] = await Promise.all([
    fetchProducts({ limit: 8 }),
    fetchCategories(),
    fetchBrands(),
  ]);

  const featuredProducts = productsData.products;

  return (
    <div className="container">
      {/* ─── Hero Principal ────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={`badge badge-green ${styles.heroBadge}`}>
            Tienda Oficial de Hardware
          </span>
          <h1 className={styles.heroTitle}>
            Componentes de <span className={styles.heroGradient}>Alto Rendimiento</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Encuentra tarjetas gráficas, procesadores, memorias RAM y almacenamiento de las mejores marcas para tu computador.
          </p>

          <div className={styles.heroActions}>
            <Link href="#catalogo" className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Ver Productos
            </Link>
            <Link href="/carrito" className="btn btn-secondary">
              Ver Mi Carrito
            </Link>
          </div>

          <div className={styles.perksRow}>
            <div className={styles.perkItem}>
              <span className={styles.perkIcon}>⚡</span> Envíos a todo Chile
            </div>
            <div className={styles.perkItem}>
              <span className={styles.perkIcon}>🛡️</span> Garantía oficial de fábrica
            </div>
            <div className={styles.perkItem}>
              <span className={styles.perkIcon}>💳</span> Checkout Sandbox seguro
            </div>
          </div>
        </div>
      </section>

      {/* ─── Cinta de Marcas ───────────────────────────────────────────── */}
      <section className={styles.brandsSection}>
        <div className={styles.brandsContainer}>
          <span className={styles.brandsLabel}>Marcas Oficiales Disponibles</span>
          <div className={styles.brandsList}>
            {brands.map((brand) => (
              <span key={brand.id} className={styles.brandPill}>
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categorías Principales ────────────────────────────────────── */}
      <section id="categorias" className="section-sm">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Categorías</h2>
            <p className={styles.sectionSubtitle}>Explora el catálogo según el tipo de componente</p>
          </div>
        </div>
        <div className={styles.categoriesGrid}>
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* ─── Catálogo de Productos Destacados ──────────────────────────── */}
      <section id="catalogo" className="section">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Catálogo de Productos</h2>
            <p className={styles.sectionSubtitle}>
              Selecciona tus componentes y agrégalos directamente al carrito de compras
            </p>
          </div>
        </div>

        <div className={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── Banner Informativo ────────────────────────────────────────── */}
      <section className={styles.promoBanner}>
        <div className={styles.promoContent}>
          <h2 className={styles.promoTitle}>¿Listo para armar tu configuración?</h2>
          <p className={styles.promoText}>
            Todos nuestros productos cuentan con stock disponible y pruebas de compatibilidad técnica.
          </p>
          <Link href="/carrito" className="btn btn-primary">
            Revisar Carrito de Compras
          </Link>
        </div>
      </section>
    </div>
  );
}
