import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        {/* Columna Marca */}
        <div className={styles.brandCol}>
          <div className={styles.logo}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>NEXUS<span className={styles.logoHighlight}>HARDWARE</span></span>
          </div>
          <p className={styles.description}>
            E-commerce de alto rendimiento especializado en hardware premium, componentes de vanguardia y configuraciones entusiastas.
          </p>
          <div className={styles.badges}>
            <span className="badge badge-green">Envíos a todo Chile</span>
            <span className="badge badge-blue">Garantía Oficial</span>
          </div>
        </div>

        {/* Columna Categorías */}
        <div>
          <h4 className={styles.columnTitle}>Categorías</h4>
          <ul className={styles.linkList}>
            <li><Link href="/productos?category=tarjetas-graficas">Tarjetas Gráficas</Link></li>
            <li><Link href="/productos?category=procesadores">Procesadores</Link></li>
            <li><Link href="/productos?category=memorias-ram">Memorias RAM</Link></li>
            <li><Link href="/productos?category=almacenamiento-ssd">Almacenamiento SSD</Link></li>
            <li><Link href="/productos?category=placas-madre">Placas Madre</Link></li>
            <li><Link href="/productos?category=fuentes-de-poder">Fuentes de Poder</Link></li>
          </ul>
        </div>

        {/* Columna Marcas */}
        <div>
          <h4 className={styles.columnTitle}>Marcas</h4>
          <ul className={styles.linkList}>
            <li><Link href="/productos?brand=asus">ASUS ROG</Link></li>
            <li><Link href="/productos?brand=nvidia">NVIDIA</Link></li>
            <li><Link href="/productos?brand=amd">AMD</Link></li>
            <li><Link href="/productos?brand=kingston">Kingston Fury</Link></li>
            <li><Link href="/productos?brand=corsair">Corsair</Link></li>
            <li><Link href="/productos?brand=intel">Intel</Link></li>
            <li><Link href="/productos?brand=msi">MSI</Link></li>
            <li><Link href="/productos?brand=samsung">Samsung</Link></li>
          </ul>
        </div>

        {/* Columna Soporte / Sandbox */}
        <div>
          <h4 className={styles.columnTitle}>Transacciones Seguras</h4>
          <div className={styles.contactInfo}>
            <p className={styles.description}>
              Pasarela de pago simulada para entorno de pruebas de rendimiento (Sandbox Flow / Webpay).
            </p>
            <div className={styles.contactItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span>Simulación Webpay / Flow Sandbox</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra Inferior */}
      <div className={`container ${styles.bottomBar}`}>
        <p>© {new Date().getFullYear()} NexusHardware SpA. Todos los derechos reservados.</p>
        <p className={styles.academicCredit}>
          Proyecto <span className={styles.academicHighlight}>Desempeño de Sistemas 2026</span> — Universidad Tecnológica Metropolitana (UTEM)
        </p>
      </div>
    </footer>
  );
}

