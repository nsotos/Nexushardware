import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import AddToCartDetail from "@/components/ui/AddToCartDetail";
import ProductCard from "@/components/ui/ProductCard";
import ProductAnalyticsTracker from "./ProductAnalyticsTracker";
import styles from "./detalle.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Obtenemos productos relacionados de la misma categoría
  const relatedRes = await fetchProducts({
    category: product.category,
    limit: 4,
  });
  const relatedProducts = relatedRes.products.filter((p) => p.id !== product.id).slice(0, 3);

  // Parseo seguro de especificaciones técnicas
  let parsedSpecs: Record<string, string> = {};
  if (product.specs) {
    if (typeof product.specs === "string") {
      try {
        parsedSpecs = JSON.parse(product.specs);
      } catch {
        parsedSpecs = {};
      }
    } else if (typeof product.specs === "object") {
      parsedSpecs = product.specs as Record<string, string>;
    }
  }

  const badgeClass =
    product.badge === "Nuevo"
      ? "badge-green"
      : product.badge === "Oferta"
      ? "badge-orange"
      : "badge-blue";

  return (
    <div className={`container ${styles.detailPage}`}>
      {/* Tracker de GA4: dispara evento view_item en el cliente */}
      <ProductAnalyticsTracker product={product} />

      {/* Migas de pan / Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Migas de pan">
        <Link href="/" className={styles.breadcrumbLink}>
          Inicio
        </Link>
        <span>/</span>
        <Link href="/productos" className={styles.breadcrumbLink}>
          Catálogo
        </Link>
        <span>/</span>
        <Link
          href={`/productos?categoria=${encodeURIComponent(product.category)}`}
          className={styles.breadcrumbLink}
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbCurrent}>{product.name}</span>
      </nav>

      {/* Grid Principal del Producto */}
      <div className={styles.mainGrid}>
        {/* Imagen y Badges */}
        <div className={styles.imageSection}>
          {product.badge && (
            <span className={`badge ${badgeClass} ${styles.badge}`}>
              {product.badge}
            </span>
          )}
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={450}
            className={styles.productImage}
            priority
            unoptimized
          />
        </div>

        {/* Información y Compra */}
        <div className={styles.infoSection}>
          <span className={styles.brand}>{product.brand}</span>
          <h1 className={styles.title}>{product.name}</h1>

          {/* Rating */}
          <div className={styles.ratingRow}>
            <span className={styles.stars}>★ {product.rating.toFixed(1)}</span>
            <span className={styles.ratingCount}>
              ({product.reviews ?? 14} valoraciones de usuarios)
            </span>
            <span>•</span>
            <span style={{ color: product.stock > 0 ? "var(--color-secondary)" : "#dc2626", fontWeight: 700 }}>
              {product.stock > 0 ? `En Stock (${product.stock} unidades)` : "Agotado"}
            </span>
          </div>

          {/* Precio y Descuento */}
          <div className={styles.priceBox}>
            <div className={styles.price}>
              <span>{formatCLP(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className={styles.originalPrice}>
                    {formatCLP(product.originalPrice)}
                  </span>
                  <span className={styles.discountBadge}>
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Descripción */}
          <p className={styles.description}>{product.description}</p>

          {/* Componente interactivo para añadir al carrito con cantidad */}
          <AddToCartDetail product={product} />
        </div>
      </div>

      {/* Especificaciones Técnicas */}
      <div className={styles.specsSection}>
        <h2 className={styles.specsTitle}>Especificaciones Técnicas</h2>
        <table className={styles.specsTable}>
          <tbody>
            <tr>
              <th>Marca Oficial</th>
              <td>{product.brand}</td>
            </tr>
            <tr>
              <th>Categoría de Hardware</th>
              <td>{product.category}</td>
            </tr>
            <tr>
              <th>Código / Modelo SKU</th>
              <td>NX-{product.id}-{product.slug.toUpperCase().slice(0, 8)}</td>
            </tr>
            <tr>
              <th>Disponibilidad Inmediata</th>
              <td>{product.stock} unidades listas para despacho</td>
            </tr>
            <tr>
              <th>Garantía Oficial</th>
              <td>24 meses por fabricante oficial</td>
            </tr>
            {parsedSpecs &&
              Object.entries(parsedSpecs).map(([key, val]) => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>{String(val)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "20px" }}>
            Componentes Relacionados de {product.category}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

