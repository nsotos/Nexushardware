/**
 * NexusHardware — Script de Seed para Base de Datos
 * Puebla la base de datos PostgreSQL con marcas, categorías, usuarios y un catálogo
 * realista y expandido de 48 componentes de hardware para pruebas de rendimiento y carga.
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando proceso de seed en NexusHardware...");

  // 1. Limpieza de tablas previas (en orden estricto de dependencias relacionales)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Tablas limpiadas correctamente.");

  // 2. Creación de Usuarios de prueba (Admin y Cliente)
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
  console.log(`🏷️  ${brandsData.length} marcas registradas.`);

  // 4. Creación de Categorías Principales
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

  // 5. Catálogo Completo de Productos con Precios en CLP y Stock
  // (6 productos por categoría = 48 componentes de hardware)
  const productsData = [
    // ─── 1. Tarjetas Gráficas ──────────────────────────────────────────────
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
    {
      name: "MSI GeForce RTX 4070 SUPER 12GB Ventus 2X OC",
      slug: "msi-geforce-rtx-4070-super-12gb-ventus-2x-oc",
      description: "Doble ventilador TORX 4.0, arquitectura Ada Lovelace y soporte para DLSS 3 en resoluciones 1440p ultrarrápidas.",
      price: 699990,
      stock: 16,
      imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["tarjetas-graficas"],
      brandId: brandsMap["msi"],
    },
    {
      name: "ASUS TUF Gaming Radeon RX 7800 XT 16GB OC",
      slug: "asus-tuf-gaming-radeon-rx-7800-xt-16gb-oc",
      description: "Construcción TUF militar con 16GB GDDR6, arquitectura AMD RDNA 3 y disipador masivo con tecnología axial.",
      price: 629990,
      stock: 14,
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["tarjetas-graficas"],
      brandId: brandsMap["asus"],
    },

    // ─── 2. Procesadores ──────────────────────────────────────────────────
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
    {
      name: "Intel Core i5-14600K (14C/20T, hasta 5.3GHz)",
      slug: "intel-core-i5-14600k",
      description: "14 núcleos (6P + 8E) y 20 hilos con boost de hasta 5.3GHz, el procesador definitivo para gaming equilibrado.",
      price: 349990,
      stock: 28,
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["procesadores"],
      brandId: brandsMap["intel"],
    },
    {
      name: "AMD Ryzen 9 7950X3D (16C/32T, hasta 5.7GHz)",
      slug: "amd-ryzen-9-7950x3d",
      description: "16 núcleos y 32 hilos con 144MB de caché total gracias a 3D V-Cache, la máxima potencia para creadores y entusiastas.",
      price: 689990,
      stock: 10,
      imageUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["procesadores"],
      brandId: brandsMap["amd"],
    },
    {
      name: "Intel Core i9-14900K (24C/32T, hasta 6.0GHz)",
      slug: "intel-core-i9-14900k",
      description: "24 núcleos (8P + 16E) y 32 hilos alcanzando hasta 6.0GHz con Intel Thermal Velocity Boost para overclocking extremo.",
      price: 649990,
      stock: 12,
      imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["procesadores"],
      brandId: brandsMap["intel"],
    },

    // ─── 3. Memorias RAM ──────────────────────────────────────────────────
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
    {
      name: "Corsair Dominator Titanium DDR5 32GB (2x16GB) 6000MHz",
      slug: "corsair-dominator-titanium-ddr5-32gb-6000mhz",
      description: "Memorias de lujo con barras superiores intercambiables, chips DHX patentados y perfiles Intel XMP / AMD EXPO.",
      price: 219990,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["memorias-ram"],
      brandId: brandsMap["corsair"],
    },
    {
      name: "Kingston FURY Beast RGB DDR5 64GB (2x32GB) 5600MHz",
      slug: "kingston-fury-beast-rgb-ddr5-64gb-5600mhz",
      description: "Kit de gran capacidad 2x32GB con barra de luz RGB infrarroja patentada Kingston FURY Infrared Sync Technology.",
      price: 249990,
      stock: 18,
      imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["memorias-ram"],
      brandId: brandsMap["kingston"],
    },
    {
      name: "Corsair Vengeance LPX DDR4 32GB (2x16GB) 3200MHz",
      slug: "corsair-vengeance-lpx-ddr4-32gb-3200mhz",
      description: "Diseño de perfil bajo con disipador de aluminio puro diseñado para gabinetes compactos y máxima compatibilidad.",
      price: 79990,
      stock: 45,
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["memorias-ram"],
      brandId: brandsMap["corsair"],
    },

    // ─── 4. Almacenamiento SSD ────────────────────────────────────────────
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
    {
      name: "Samsung 980 PRO NVMe PCIe 4.0 1TB",
      slug: "samsung-980-pro-nvme-1tb",
      description: "Velocidad PCIe 4.0 probada de hasta 7.000 MB/s con control térmico inteligente niquelado para PlayStation 5 y PC.",
      price: 119990,
      stock: 32,
      imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["almacenamiento-ssd"],
      brandId: brandsMap["samsung"],
    },
    {
      name: "Kingston NV2 NVMe PCIe 4.0 2TB",
      slug: "kingston-nv2-nvme-pcie-4-2tb",
      description: "Solución de almacenamiento masivo NVMe PCIe 4.0 x4 de bajo consumo y formato compacto M.2 2280.",
      price: 114990,
      stock: 40,
      imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["almacenamiento-ssd"],
      brandId: brandsMap["kingston"],
    },
    {
      name: "Samsung 990 EVO NVMe PCIe 5.0 1TB",
      slug: "samsung-990-evo-nvme-1tb",
      description: "Compatibilidad dual PCIe 4.0 x4 y PCIe 5.0 x2 con hasta 5.000 MB/s de lectura y 70% más de eficiencia energética.",
      price: 94990,
      stock: 26,
      imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["almacenamiento-ssd"],
      brandId: brandsMap["samsung"],
    },

    // ─── 5. Placas Madre ──────────────────────────────────────────────────
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
    {
      name: "ASUS TUF Gaming B650-PLUS WiFi AM5",
      slug: "asus-tuf-gaming-b650-plus-wifi",
      description: "Socket AM5 listo para Ryzen 7000/8000/9000, 12+2 fases DrMOS, disipadores VRM masivos y ranura PCIe 5.0 M.2.",
      price: 239990,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["placas-madre"],
      brandId: brandsMap["asus"],
    },
    {
      name: "MSI PRO B760M-A WiFi DDR5",
      slug: "msi-pro-b760m-a-wifi-ddr5",
      description: "Formato Micro-ATX profesional con soporte para procesadores Intel 12va/13va/14va gen, WiFi 6E y doble puerto M.2 Gen4.",
      price: 169990,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["placas-madre"],
      brandId: brandsMap["msi"],
    },
    {
      name: "ASUS ROG Maximus Z790 Dark Hero",
      slug: "asus-rog-maximus-z790-dark-hero",
      description: "Placa madre insignia para entusiastas con 20+1+2 fases, WiFi 7, Thunderbolt 4 dual y ranura PCIe 5.0 x16.",
      price: 749990,
      stock: 6,
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["placas-madre"],
      brandId: brandsMap["asus"],
    },
    {
      name: "MSI MAG B650 Tomahawk WiFi AM5",
      slug: "msi-mag-b650-tomahawk-wifi",
      description: "Estética militar en negro mate, audio boost 5 con códec ALC4080 y conectividad LAN 2.5G de ultra baja latencia.",
      price: 259990,
      stock: 18,
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["placas-madre"],
      brandId: brandsMap["msi"],
    },

    // ─── 6. Fuentes de Poder ──────────────────────────────────────────────
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
    {
      name: "Corsair RM750e 750W 80 Plus Gold ATX 3.0",
      slug: "corsair-rm750e-750w-gold-atx-3",
      description: "Certificación 80 PLUS Gold, compatible con estándar ATX 3.0 y PCIe 5.0 con conector nativo 12VHPWR de 16 pines.",
      price: 124990,
      stock: 28,
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["fuentes-de-poder"],
      brandId: brandsMap["corsair"],
    },
    {
      name: "MSI MAG A850GL PCIE5 850W 80 Plus Gold",
      slug: "msi-mag-a850gl-pcie5-850w-gold",
      description: "Diseño compacto 140mm, cable 12V-2x6 bicolor de seguridad y ventilador FDB de cojinete dinámico de fluidos.",
      price: 139990,
      stock: 22,
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["fuentes-de-poder"],
      brandId: brandsMap["msi"],
    },
    {
      name: "ASUS ROG Thor 1000W Platinum II",
      slug: "asus-rog-thor-1000w-platinum-ii",
      description: "Pantalla OLED lateral con monitorización de consumo en tiempo real, disipadores ROG y certificación 80 PLUS Platinum.",
      price: 389990,
      stock: 8,
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["fuentes-de-poder"],
      brandId: brandsMap["asus"],
    },
    {
      name: "Corsair HX1000i 1000W Platinum Totalmente Modular",
      slug: "corsair-hx1000i-1000w-platinum-modular",
      description: "Control digital completo a través de software iCUE, topología LLC resonante y capacitores 100% japoneses.",
      price: 279990,
      stock: 12,
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["fuentes-de-poder"],
      brandId: brandsMap["corsair"],
    },

    // ─── 7. Gabinetes ─────────────────────────────────────────────────────
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
    {
      name: "ASUS TUF Gaming GT502 Dual Chamber",
      slug: "asus-tuf-gaming-gt502-dual-chamber",
      description: "Gabinete de doble cámara con paneles frontales y laterales de vidrio templado, soporte para radiadores de hasta 360mm.",
      price: 169990,
      stock: 14,
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["gabinetes"],
      brandId: brandsMap["asus"],
    },
    {
      name: "Corsair 5000D AIRFLOW Mid-Tower",
      slug: "corsair-5000d-airflow-mid-tower",
      description: "Chasis espacioso ATX con sistema de canalización de cables oculto RapidRoute y capacidad para hasta 10 ventiladores de 120mm.",
      price: 164990,
      stock: 16,
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["gabinetes"],
      brandId: brandsMap["corsair"],
    },
    {
      name: "MSI MPG Gungnir 110R ARGB",
      slug: "msi-mpg-gungnir-110r-argb",
      description: "Cuatro ventiladores ARGB preinstalados, panel frontal geométrico con vidrio templado y botón frontal Insta-Light Loop.",
      price: 949990,
      stock: 19,
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["gabinetes"],
      brandId: brandsMap["msi"],
    },
    {
      name: "Corsair iCUE 4000X RGB Vidrio Templado",
      slug: "corsair-icue-4000x-rgb-mid-tower",
      description: "Paneles frontales y laterales de cristal templado, tres ventiladores SP RGB ELITE y controlador iCUE Lighting Node CORE incluido.",
      price: 134990,
      stock: 18,
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["gabinetes"],
      brandId: brandsMap["corsair"],
    },

    // ─── 8. Refrigeración ─────────────────────────────────────────────────
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
    {
      name: "MSI MAG CoreLiquid 240R V2 Líquida",
      slug: "msi-mag-coreliquid-240r-v2",
      description: "Bomba integrada en el radiador para amortiguar resonancia, dos ventiladores ARGB de 120mm y cabezal rotativo 270 grados.",
      price: 99990,
      stock: 22,
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["refrigeracion"],
      brandId: brandsMap["msi"],
    },
    {
      name: "Corsair iCUE LINK H100i RGB Líquida 240mm",
      slug: "corsair-icue-link-h100i-rgb-240mm",
      description: "Ecosistema iCUE LINK con conexión de un solo cable universal sin desorden, iluminación RGB de 20 LEDs y radiador de 240mm.",
      price: 189990,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["refrigeracion"],
      brandId: brandsMap["corsair"],
    },
    {
      name: "ASUS TUF Gaming LC II 360 ARGB Líquida",
      slug: "asus-tuf-gaming-lc-ii-360-argb",
      description: "Tres ventiladores TUF Gaming ARGB con aletas ranuradas para flujo optimizado y tubos reforzados de 400mm con manga mallada.",
      price: 159990,
      stock: 16,
      imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["refrigeracion"],
      brandId: brandsMap["asus"],
    },
    {
      name: "Corsair H60x RGB ELITE Líquida 120mm",
      slug: "corsair-h60x-rgb-elite-liquida-120mm",
      description: "Solución de refrigeración líquida compacta All-in-One de 120mm con placa refrigerante de cobre y ventilador SP120 RGB ELITE.",
      price: 79990,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
      categoryId: categoriesMap["refrigeracion"],
      brandId: brandsMap["corsair"],
    },
  ];

  // 6. Inserción iterativa de productos
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
