/**
 * NexusHardware — Script de Seed para Base de Datos
 * Puebla la base de datos con marcas, categorías, productos de hardware y usuarios de prueba.
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando proceso de seed en NexusHardware...");

  // 1. Limpieza de tablas previas (en orden de dependencias)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Tablas limpiadas correctamente.");

  // 2. Creación de Usuarios (Admin y Cliente de prueba)
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@nexushardware.cl",
      password: hashedPassword,
      name: "Administrador Nexus",
      role: "ADMIN",
    },
  });

  const cliente = await prisma.user.create({
    data: {
      email: "cliente@utem.cl",
      password: hashedPassword,
      name: "Estudiante UTEM",
      role: "CUSTOMER",
    },
  });

  console.log(`👤 Usuarios creados: ${admin.email}, ${cliente.email}`);

  // 3. Creación de Marcas Oficiales
  const brandsData = [
    { name: "ASUS", slug: "asus", logoUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=200&q=80" },
    { name: "NVIDIA", slug: "nvidia", logoUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=200&q=80" },
    { name: "AMD", slug: "amd", logoUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=200&q=80" },
    { name: "Kingston", slug: "kingston", logoUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=200&q=80" },
    { name: "Corsair", slug: "corsair", logoUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=200&q=80" },
    { name: "Intel", slug: "intel", logoUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80" },
    { name: "MSI", slug: "msi", logoUrl: "https://images.unsplash.com/photo-1587202372574-32705e3bf49c?auto=format&fit=crop&w=200&q=80" },
    { name: "Samsung", slug: "samsung", logoUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=200&q=80" },
  ];

  const brandsMap = {};
  for (const b of brandsData) {
    const created = await prisma.brand.create({ data: b });
    brandsMap[b.slug] = created.id;
  }
  console.log(`🏷️ ${brandsData.length} marcas registradas.`);

  // 4. Creación de Categorías
  const categoriesData = [
    { name: "Tarjetas Gráficas", slug: "tarjetas-graficas" },
    { name: "Procesadores", slug: "procesadores" },
    { name: "Memorias RAM", slug: "memorias-ram" },
    { name: "Almacenamiento SSD", slug: "almacenamiento-ssd" },
    { name: "Placas Madre", slug: "placas-madre" },
    { name: "Fuentes de Poder", slug: "fuentes-de-poder" },
    { name: "Gabinetes", slug: "gabinetes" },
    { name: "Refrigeración", slug: "refrigeracion" },
  ];

  const categoriesMap = {};
  for (const c of categoriesData) {
    const created = await prisma.category.create({ data: c });
    categoriesMap[c.slug] = created.id;
  }
  console.log(`📁 ${categoriesData.length} categorías registradas.`);

  // 5. Catálogo de Productos con Precios en CLP y Stock
  const productsData = [
    // Tarjetas Gráficas
    {
      name: "NVIDIA GeForce RTX 4080 Super 16GB",
      slug: "nvidia-geforce-rtx-4080-super-16gb",
      description: "Tarjeta gráfica de alto rendimiento con arquitectura Ada Lovelace, DLSS 3 y trazado de rayos de 3ra generación.",
      price: 1199990,
      stock: 12,
      imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["tarjetas-graficas"],
      brandId: brandsMap["nvidia"],
    },
    {
      name: "ASUS ROG Strix GeForce RTX 4070 Ti 12GB OC",
      slug: "asus-rog-strix-rtx-4070-ti-12gb-oc",
      description: "Diseño axial-tech avanzado, iluminación Aura Sync RGB y disipador masivo de 3.15 slots.",
      price: 949990,
      stock: 18,
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["tarjetas-graficas"],
      brandId: brandsMap["asus"],
    },
    {
      name: "MSI Radeon RX 7900 XTX Gaming Trio Classic 24GB",
      slug: "msi-radeon-rx-7900-xtx-gaming-trio-24gb",
      description: "Potencia gráfica con arquitectura AMD RDNA 3, 24GB de memoria GDDR6 para gaming extremo en 4K.",
      price: 1089990,
      stock: 8,
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["tarjetas-graficas"],
      brandId: brandsMap["msi"],
    },
    {
      name: "ASUS Dual GeForce RTX 4060 OC Edition 8GB",
      slug: "asus-dual-rtx-4060-oc-8gb",
      description: "Eficiencia y rendimiento óptimo para 1080p con tecnología DLSS 3 y diseño compacto de dos ventiladores.",
      price: 369990,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["tarjetas-graficas"],
      brandId: brandsMap["asus"],
    },

    // Procesadores
    {
      name: "AMD Ryzen 7 7800X3D (8C/16T, hasta 5.0GHz)",
      slug: "amd-ryzen-7-7800x3d",
      description: "El mejor procesador para gaming del mundo gracias a la tecnología 3D V-Cache de 96MB en socket AM5.",
      price: 449990,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["procesadores"],
      brandId: brandsMap["amd"],
    },
    {
      name: "Intel Core i7-14700K (20C/28T, hasta 5.6GHz)",
      slug: "intel-core-i7-14700k",
      description: "Arquitectura híbrida de 14ta generación ideal para streaming, creación de contenido y juegos de alta exigencia.",
      price: 469990,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["procesadores"],
      brandId: brandsMap["intel"],
    },
    {
      name: "AMD Ryzen 5 7600X (6C/12T, hasta 5.3GHz)",
      slug: "amd-ryzen-5-7600x",
      description: "Rendimiento sobresaliente en gaming competitivo con soporte para PCIe 5.0 y memorias DDR5.",
      price: 249990,
      stock: 35,
      imageUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["procesadores"],
      brandId: brandsMap["amd"],
    },

    // Memorias RAM
    {
      name: "Kingston FURY Beast DDR5 32GB (2x16GB) 6000MHz",
      slug: "kingston-fury-beast-ddr5-32gb-6000mhz",
      description: "Kit dual channel de alta velocidad optimizado con perfiles AMD EXPO e Intel XMP 3.0.",
      price: 139990,
      stock: 40,
      imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["memorias-ram"],
      brandId: brandsMap["kingston"],
    },
    {
      name: "Corsair Vengeance RGB DDR5 32GB (2x16GB) 6400MHz",
      slug: "corsair-vengeance-rgb-ddr5-32gb-6400mhz",
      description: "Iluminación RGB dinámica de diez zonas con control en iCUE y disipador de calor de aluminio sólido.",
      price: 159990,
      stock: 22,
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["memorias-ram"],
      brandId: brandsMap["corsair"],
    },
    {
      name: "Kingston FURY Renegade DDR4 16GB (2x8GB) 3600MHz",
      slug: "kingston-fury-renegade-ddr4-16gb-3600mhz",
      description: "Memoria DDR4 de latencia ultrabaja CL16 ideal para upgrades confiables y económicos.",
      price: 54990,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["memorias-ram"],
      brandId: brandsMap["kingston"],
    },

    // Almacenamiento SSD
    {
      name: "Samsung 990 PRO NVMe M.2 SSD 2TB PCIe 4.0",
      slug: "samsung-990-pro-nvme-2tb",
      description: "Velocidades secuenciales líderes de hasta 7.450 MB/s de lectura y 6.900 MB/s de escritura.",
      price: 199990,
      stock: 28,
      imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["almacenamiento-ssd"],
      brandId: brandsMap["samsung"],
    },
    {
      name: "Kingston KC3000 NVMe PCIe 4.0 1TB",
      slug: "kingston-kc3000-nvme-1tb",
      description: "Disipador térmico de aluminio con grafeno y velocidades extremas de 7.000 MB/s para cargas de trabajo pesadas.",
      price: 99990,
      stock: 35,
      imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["almacenamiento-ssd"],
      brandId: brandsMap["kingston"],
    },
    {
      name: "Samsung 870 EVO SATA 2.5\" SSD 1TB",
      slug: "samsung-870-evo-sata-1tb",
      description: "Confiabilidad probada con tecnología V-NAND y controlador MKX para almacenamiento masivo rápido.",
      price: 79990,
      stock: 45,
      imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["almacenamiento-ssd"],
      brandId: brandsMap["samsung"],
    },

    // Placas Madre
    {
      name: "ASUS ROG Strix B650-A Gaming WiFi AM5",
      slug: "asus-rog-strix-b650-a-gaming-wifi",
      description: "Diseño blanco y plateado, VRM robusto de 12+2 fases, PCIe 5.0 M.2 y conectividad WiFi 6E.",
      price: 289990,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["placas-madre"],
      brandId: brandsMap["asus"],
    },
    {
      name: "MSI MAG Z790 Tomahawk WiFi DDR5 (LGA1700)",
      slug: "msi-mag-z790-tomahawk-wifi",
      description: "Placa de gama alta con 16+1+1 fases digitales, 4 slots M.2 con Shield Frozr y soporte DDR5 hasta 7200+ MHz.",
      price: 329990,
      stock: 14,
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["placas-madre"],
      brandId: brandsMap["msi"],
    },

    // Fuentes de Poder
    {
      name: "Corsair RM850x 850W 80 Plus Gold Modular",
      slug: "corsair-rm850x-850w-gold",
      description: "Condensadores japoneses a 105°C, ventilador de levitación magnética y certificación de eficiencia 80 PLUS Gold.",
      price: 149990,
      stock: 24,
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["fuentes-de-poder"],
      brandId: brandsMap["corsair"],
    },
    {
      name: "ASUS TUF Gaming 750W 80 Plus Bronze",
      slug: "asus-tuf-gaming-750w-bronze",
      description: "Construcción de grado militar con revestimiento de PCB de protección y rodamientos de doble bola.",
      price: 89990,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["fuentes-de-poder"],
      brandId: brandsMap["asus"],
    },

    // Gabinetes
    {
      name: "Corsair 4000D Airflow Vidrio Templado Mid-Tower",
      slug: "corsair-4000d-airflow-mid-tower",
      description: "Panel frontal optimizado para alto flujo de aire, sistema de gestión de cables RapidRoute y dos ventiladores AirGuide.",
      price: 99990,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["gabinetes"],
      brandId: brandsMap["corsair"],
    },
    {
      name: "MSI MAG Forge 100R RGB Mid-Tower",
      slug: "msi-mag-forge-100r-rgb",
      description: "Incluye dos ventiladores ARGB frontales de 120mm, panel lateral de vidrio templado de 4mm y hub de control.",
      price: 64990,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["gabinetes"],
      brandId: brandsMap["msi"],
    },

    // Refrigeración
    {
      name: "Corsair iCUE H150i ELITE LCD XT Líquida 360mm",
      slug: "corsair-icue-h150i-elite-lcd-xt",
      description: "Pantalla IPS personalizada de 2.1\", tres ventiladores AF120 RGB ELITE y pasta térmica de alto rendimiento preaplicada.",
      price: 269990,
      stock: 10,
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["refrigeracion"],
      brandId: brandsMap["corsair"],
    },
    {
      name: "ASUS ROG Ryujin III 360 ARGB Líquida",
      slug: "asus-rog-ryujin-iii-360-argb",
      description: "Bomba Asetek de 8va generación con ventilador incrustado para VRMs y pantalla LCD de 3.5\" a 60Hz.",
      price: 349990,
      stock: 8,
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["refrigeracion"],
      brandId: brandsMap["asus"],
    },
  ];

  for (const p of productsData) {
    await prisma.product.create({ data: p });
  }

  console.log(`📦 ${productsData.length} productos insertados exitosamente en la tienda.`);
  console.log("✅ Proceso de seed finalizado con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
