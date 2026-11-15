"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder, OrderVoucher } from "@/lib/api";
import { trackPurchase } from "@/lib/gtag";
import styles from "./checkout.module.css";

function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  // Datos de despacho
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [rut, setRut] = useState("19.876.543-2");
  const [address, setAddress] = useState("Av. Libertador Bernardo O'Higgins 1449");
  const [city, setCity] = useState("Santiago Centro");
  const [phone, setPhone] = useState("+56 9 8765 4321");

  // Estados de proceso
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completedOrder, setCompletedOrder] = useState<{
    id: number | string;
    total: number;
    shippingAddress: string;
    voucher: OrderVoucher;
    items: typeof items;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("No tienes productos en el carrito para procesar una compra.");
      return;
    }

    if (!address.trim() || !city.trim() || !fullName.trim()) {
      setErrorMessage("Por favor, completa los campos requeridos de despacho.");
      return;
    }

    setIsSubmitting(true);

    try {
      const fullShippingAddress = `${address.trim()}, ${city.trim()} (Contacto: ${fullName.trim()} - Tel: ${phone.trim()})`;

      const orderPayload = {
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
        shippingAddress: fullShippingAddress,
      };

      const res = await createOrder(orderPayload, token);

      if (!res.success || !res.order) {
        setErrorMessage(res.message || "Error al procesar el pago en el servidor.");
        setIsSubmitting(false);
        return;
      }

      // Orden exitosa
      const voucherData: OrderVoucher = res.order.voucher || {
        authorizationCode: Math.floor(100000 + Math.random() * 900000).toString(),
        responseCode: 0,
        cardNumber: "**** **** **** 6623",
        transactionDate: new Date().toISOString(),
        amount: res.order.total,
        paymentType: "Transbank Webpay Plus (Sandbox)",
      };

      // Disparar evento de comercio electrónico GA4: purchase
      trackPurchase({
        id: res.order.id,
        total: res.order.total,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      // Guardar el estado de orden completada antes de vaciar el carrito
      setCompletedOrder({
        id: res.order.id,
        total: res.order.total,
        shippingAddress: res.order.shippingAddress || fullShippingAddress,
        voucher: voucherData,
        items: [...items],
      });

      // Vaciar carrito
      clearCart();
    } catch (err: any) {
      setErrorMessage("Ocurrió un error inesperado al procesar la transacción.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // VISTA: Si la compra ya se completó con éxito -> Desplegar Comprobante Webpay Plus
  if (completedOrder) {
    return (
      <div className={`container ${styles.checkoutPage}`}>
        <div className={styles.voucherCard}>
          <div className={styles.voucherHeader}>
            <span className={styles.voucherBadge}>Transacción Aprobada</span>
            <h1 className={styles.voucherTitle}>Comprobante de Pago Webpay Plus</h1>
            <p className={styles.voucherSubtitle}>
              Simulación Sandbox Oficial — NexusHardware E-commerce (UTEM)
            </p>
          </div>

          <div className={styles.voucherBody}>
            <div className={styles.voucherRow}>
              <span className={styles.voucherLabel}>Número de Orden / Transacción:</span>
              <span className={styles.voucherValue}>#{completedOrder.id}</span>
            </div>

            <div className={styles.voucherRow}>
              <span className={styles.voucherLabel}>Código de Autorización:</span>
              <span className={styles.voucherValue}>
                {completedOrder.voucher.authorizationCode}
              </span>
            </div>

            <div className={styles.voucherRow}>
              <span className={styles.voucherLabel}>Medio de Pago:</span>
              <span className={styles.voucherValue}>
                {completedOrder.voucher.paymentType}
              </span>
            </div>

            <div className={styles.voucherRow}>
              <span className={styles.voucherLabel}>Tarjeta:</span>
              <span className={styles.voucherValue}>
                {completedOrder.voucher.cardNumber}
              </span>
            </div>

            <div className={styles.voucherRow}>
              <span className={styles.voucherLabel}>Fecha y Hora:</span>
              <span className={styles.voucherValue}>
                {new Date(completedOrder.voucher.transactionDate).toLocaleString("es-CL")}
              </span>
            </div>

            <div className={styles.voucherRow}>
              <span className={styles.voucherLabel}>Destinatario y Dirección:</span>
              <span className={styles.voucherValue}>{completedOrder.shippingAddress}</span>
            </div>

            <div className={styles.voucherRow}>
              <span className={styles.voucherLabel}>Productos adquiridos:</span>
              <span className={styles.voucherValue}>
                {completedOrder.items.length} tipo(s) de componente
              </span>
            </div>

            <div className={`${styles.voucherRow} ${styles.voucherTotal}`}>
              <span>Monto Total Pagado:</span>
              <span>{formatCLP(completedOrder.total)}</span>
            </div>
          </div>

          <div className={styles.voucherActions}>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-secondary"
            >
              🖨️ Imprimir Voucher
            </button>
            <Link href="/productos" className="btn btn-primary">
              Volver al Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // VISTA: Si no hay orden y el carrito está vacío
  if (items.length === 0) {
    return (
      <div className={`container ${styles.checkoutPage}`}>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2>No tienes productos para finalizar tu compra</h2>
          <p style={{ color: "var(--color-text-muted)", margin: "16px 0 24px" }}>
            Agrega componentes de hardware desde el catálogo para iniciar el checkout.
          </p>
          <Link href="/productos" className="btn btn-primary">
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.checkoutPage}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Checkout Seguro (Sandbox)</h1>
        <p className={styles.subtitle}>
          Completa tus datos de envío para procesar la simulación de pago con Webpay Plus
        </p>
      </div>

      {errorMessage && <div className={styles.errorBanner}>{errorMessage}</div>}

      <div className={styles.checkoutGrid}>
        {/* Formulario de Despacho */}
        <div className={styles.formCard}>
          <h2 className={styles.sectionTitle}>
            <span>📍</span> Datos de Entrega y Facturación
          </h2>

          {!user && (
            <div className={styles.authNotice}>
              <p>
                <strong>Consejo:</strong> No has iniciado sesión. Puedes completar la compra como invitado o acceder con tu cuenta para guardar tu orden en el historial.
              </p>
              <Link href="/login" className="btn btn-secondary" style={{ display: "inline-block", fontSize: "0.85rem", padding: "6px 14px" }}>
                Iniciar Sesión
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nombre Completo *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Nicolás Torres"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>RUT o DNI *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  placeholder="Ej: 19.876.543-2"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@utem.cl"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Teléfono de Contacto *</label>
                <input
                  type="tel"
                  required
                  className={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Dirección (Calle y Número) *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: Av. Dieciocho 161, Depto 402"
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Ciudad / Comuna *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej: Santiago Centro, Región Metropolitana"
                />
              </div>
            </div>

            {/* Caja de Pasarela Webpay Plus */}
            <div className={styles.paymentBox}>
              <div className={styles.paymentTitle}>
                <span>🔒</span> Pasarela de Pago: Transbank Webpay Plus (Sandbox)
              </div>
              <p className={styles.paymentDesc}>
                Ambiente de pruebas activo. La transacción descontará inventario en la base de datos PostgreSQL y generará un comprobante electrónico con código de autorización real simulado (tarjeta 6623).
              </p>
            </div>

            <div style={{ marginTop: "24px" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-full"
                style={{ padding: "14px", fontSize: "1rem" }}
              >
                {isSubmitting
                  ? "Procesando pago con Webpay..."
                  : `Confirmar y Pagar ${formatCLP(totalPrice)}`}
              </button>
            </div>
          </form>
        </div>

        {/* Resumen de la Orden */}
        <aside className={styles.summaryCard}>
          <h2 className={styles.sectionTitle}>
            <span>🛒</span> Resumen de Compra
          </h2>

          <div className={styles.itemList}>
            {items.map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemMeta}>
                    {item.brand} | {item.quantity} x {formatCLP(item.price)}
                  </span>
                </div>
                <span className={styles.itemPrice}>
                  {formatCLP(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.summaryRow}>
            <span>Total Artículos</span>
            <span>{totalItems} unid.</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Despacho a Domicilio</span>
            <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>
              Gratis
            </span>
          </div>

          <div className={styles.totalRow}>
            <span>Total a Pagar</span>
            <span>{formatCLP(totalPrice)}</span>
          </div>

          <Link href="/carrito" className="btn btn-secondary btn-full">
            Modificar Carrito
          </Link>
        </aside>
      </div>
    </div>
  );
}

