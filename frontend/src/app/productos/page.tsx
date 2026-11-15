"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import { fetchProducts, fetchCategories, fetchBrands, Category, Brand } from "@/lib/api";
import type { Product } from "@/lib/mockData";
import styles from "./productos.module.css";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchParam = searchParams.get("search") || "";
  const categoryParam =
    searchParams.get("categoria") || searchParams.get("category") || "";
  const brandParam = searchParams.get("marca") || searchParams.get("brand") || "";
  const ofertasParam = searchParams.get("ofertas") === "true";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados locales de filtrado
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState<string>(brandParam);
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSelectedBrand(brandParam);
  }, [brandParam]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, cats, brs] = await Promise.all([
          fetchProducts({ limit: 60 }),
          fetchCategories(),
          fetchBrands(),
        ]);
        setProducts(prodRes.products);
        setCategories(cats);
        setBrands(brs);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtrado reactivo en cliente (más rápido y fluido ante interacciones)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      const catNorm = selectedCategory.toLowerCase();
      result = result.filter(
        (p) =>
          p.category.toLowerCase() === catNorm ||
          p.category.toLowerCase().replace(/\s+/g, "-") === catNorm ||
          p.category.toLowerCase().includes(catNorm) ||
          catNorm.includes(p.category.toLowerCase())
      );
    }

    if (selectedBrand) {
      const bNorm = selectedBrand.toLowerCase();
      result = result.filter(
        (p) =>
          p.brand.toLowerCase() === bNorm ||
          p.brand.toLowerCase().replace(/\s+/g, "-") === bNorm
      );
    }

    if (ofertasParam) {
      result = result.filter(
        (p) =>
          p.badge === "Oferta" ||
          (p.originalPrice !== undefined && p.originalPrice > p.price)
      );
    }

    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchParam, selectedCategory, selectedBrand, ofertasParam, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSortBy("default");
    router.push("/productos");
  };

  return (
    <div className={`container ${styles.catalogPage}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {ofertasParam ? "Ofertas y Descuentos Especiales" : "Catálogo de Componentes de Hardware"}
        </h1>
        <p className={styles.subtitle}>
          Explora 48 productos de alto rendimiento con stock y garantía oficial
        </p>
      </div>

      <div className={styles.catalogLayout}>
        {/* Panel lateral de filtros */}
        <aside className={styles.filtersSidebar}>
          {/* Categorías */}
          <div className={styles.filterGroup}>
            <h3 className={styles.filterHeading}>Categorías</h3>
            <ul className={styles.filterList}>
              <li
                className={`${styles.filterItem} ${!selectedCategory ? styles.filterItemActive : ""}`}
                onClick={() => setSelectedCategory("")}
              >
                <span>Todas</span>
                <span>{products.length}</span>
              </li>
              {categories.map((cat) => {
                const count = products.filter(
                  (p) => p.category.toLowerCase() === cat.name.toLowerCase()
                ).length;
                return (
                  <li
                    key={cat.id}
                    className={`${styles.filterItem} ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase()
                        ? styles.filterItemActive
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory.toLowerCase() === cat.name.toLowerCase() ? "" : cat.name
                      )
                    }
                  >
                    <span>{cat.name}</span>
                    <span>{count || ""}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Marcas */}
          <div className={styles.filterGroup}>
            <h3 className={styles.filterHeading}>Marcas Oficiales</h3>
            <ul className={styles.filterList}>
              <li
                className={`${styles.filterItem} ${!selectedBrand ? styles.filterItemActive : ""}`}
                onClick={() => setSelectedBrand("")}
              >
                <span>Todas</span>
              </li>
              {brands.map((b) => (
                <li
                  key={b.id}
                  className={`${styles.filterItem} ${
                    selectedBrand.toLowerCase() === b.name.toLowerCase()
                      ? styles.filterItemActive
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedBrand(
                      selectedBrand.toLowerCase() === b.name.toLowerCase() ? "" : b.name
                    )
                  }
                >
                  <span>{b.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {(selectedCategory || selectedBrand || searchParam || sortBy !== "default") && (
            <button
              type="button"
              className={styles.resetBtn}
              onClick={handleResetFilters}
            >
              Limpiar Todos los Filtros
            </button>
          )}
        </aside>

        {/* Listado de Productos */}
        <div>
          <div className={styles.toolbar}>
            <div className={styles.resultsCount}>
              Mostrando <strong>{filteredProducts.length}</strong> de{" "}
              <strong>{products.length}</strong> componentes
              {searchParam && ` para "${searchParam}"`}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label htmlFor="sort" style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                Ordenar por:
              </label>
              <select
                id="sort"
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Relevancia</option>
                <option value="price_asc">Menor Precio</option>
                <option value="price_desc">Mayor Precio</option>
                <option value="rating">Mejor Calificación</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p>Cargando componentes de hardware...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3 className={styles.emptyTitle}>No encontramos resultados</h3>
              <p style={{ color: "var(--color-text-muted)", marginBottom: "16px" }}>
                Intenta ajustar los filtros de búsqueda o categoría seleccionada.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleResetFilters}
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "60px 0", textAlign: "center" }}>Cargando catálogo...</div>}>
      <CatalogContent />
    </Suspense>
  );
}

