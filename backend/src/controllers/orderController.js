/**
 * NexusHardware — Controlador de Órdenes y Checkout
 * Procesa compras atómicas con verificación y descuento de stock en PostgreSQL,
 * generando un voucher simulado de pasarela chilena (Transbank Webpay Plus / Flow).
 */

const prisma = require("../prisma/client");

/**
 * Crea una nueva orden de compra y simula el checkout con Webpay Plus
 * POST /api/orders
 */
async function createOrder(req, res) {
  try {
    const { items, shippingAddress, paymentMethod = "WEBPAY" } = req.body;
    const userId = req.user.id;

    // 1. Validación de entrada
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El carrito debe contener al menos un producto",
      });
    }

    for (const item of items) {
      if (!item.productId || typeof item.productId !== "number" || item.productId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Cada ítem debe tener un 'productId' numérico válido",
        });
      }
      if (!item.quantity || typeof item.quantity !== "number" || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "La cantidad de cada ítem debe ser un entero positivo",
        });
      }
    }

    // 2. Transacción Atómica con Prisma (ACID)
    // Garantiza que bajo alta concurrencia de pruebas de carga no ocurra sobreventa (race condition).
    const result = await prisma.$transaction(async (tx) => {
      const productIds = items.map((i) => i.productId);

      // Consulta de productos en la base de datos
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      // Verificación de existencia y disponibilidad de stock
      for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product) {
          const err = new Error(`El producto con ID ${item.productId} no existe`);
          err.name = "ProductNotFound";
          err.productId = item.productId;
          throw err;
        }

        if (product.stock < item.quantity) {
          const err = new Error(
            `Stock insuficiente para '${product.name}'. Disponible: ${product.stock}, solicitado: ${item.quantity}`
          );
          err.name = "InsufficientStock";
          err.product = product.name;
          err.available = product.stock;
          err.requested = item.quantity;
          throw err;
        }
      }

      // Descuento de stock en PostgreSQL
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      // Cálculo del monto total en CLP
      let totalAmount = 0;
      const orderItemsData = items.map((item) => {
        const product = productMap.get(item.productId);
        const unitPriceNum = Number(product.price);
        totalAmount += unitPriceNum * item.quantity;

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
        };
      });

      // Creación del registro de la Orden en PostgreSQL
      const order = await tx.order.create({
        data: {
          userId,
          status: "PAID",
          total: totalAmount,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  imageUrl: true,
                  price: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // 3. Generación del comprobante / voucher de Webpay Plus simulado
      const authorizationCode = String(Math.floor(100000 + Math.random() * 900000));
      const voucher = {
        gateway: "Transbank Webpay Plus (Simulador)",
        authorizationCode,
        paymentTypeCode: paymentMethod === "WEBPAY" ? "VD" : "FLOW",
        paymentDescription: paymentMethod === "WEBPAY" ? "Venta Débito (Redcompra)" : "Flow Sandbox Pago Online",
        responseCode: 0,
        responseDescription: "Transacción Aprobada Exitosamente",
        cardNumber: "**** **** **** 6623",
        amount: totalAmount,
        currency: "CLP",
        transactionDate: order.createdAt,
        shippingAddress: shippingAddress || "Retiro en Tienda NexusHardware (Santiago Centro)",
      };

      return { order, voucher };
    });

    return res.status(201).json({
      success: true,
      message: "Compra procesada exitosamente",
      data: result.order,
      voucher: result.voucher,
    });
  } catch (error) {
    if (error.name === "ProductNotFound") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error.name === "InsufficientStock") {
      return res.status(400).json({
        success: false,
        error: error.message,
        details: {
          product: error.product,
          available: error.available,
          requested: error.requested,
        },
      });
    }

    console.error("Error al procesar la orden:", error);
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor al procesar la orden",
    });
  }
}

/**
 * Obtiene el historial de órdenes del usuario autenticado
 * GET /api/orders/my-orders
 */
async function getMyOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    return res.status(500).json({
      success: false,
      error: "Error interno al recuperar el historial de órdenes",
    });
  }
}

/**
 * Obtiene el detalle de una orden específica por su ID
 * GET /api/orders/:id
 */
async function getOrderById(req, res) {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (isNaN(orderId) || orderId <= 0) {
      return res.status(400).json({
        success: false,
        error: "El ID de la orden debe ser un número entero válido",
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Orden no encontrada",
      });
    }

    // Seguridad: solo el dueño de la orden o un administrador puede verla
    if (order.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "No tienes autorización para consultar esta orden",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return res.status(500).json({
      success: false,
      error: "Error interno al obtener el detalle de la orden",
    });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
