"""
NexusHardware — Configuración y Parámetros de Pruebas de Carga (Locust)
Contiene las credenciales de prueba, URLs base y datasets de consulta para
simular tráfico realista en el backend de NexusHardware (puerto 4000).
"""

import os

# Host base de la API REST del backend
BASE_URL = os.getenv("TARGET_HOST", "http://localhost:4000")

# Credenciales del cliente de prueba (creado en el seed de la base de datos)
BASE_USER = {
    "email": "cliente@utem.cl",
    "password": "Password123!",
}

# Términos de búsqueda frecuentes para simular intención de compra variada
SEARCH_TERMS = [
    "rtx",
    "ryzen",
    "asus",
    "corsair",
    "ddr5",
    "ssd",
    "intel",
    "msi",
    "samsung",
    "kingston",
    "4080",
    "7800x3d",
]

# Slugs reales existentes en la base de datos PostgreSQL (seed de 48 productos)
SAMPLE_SLUGS = [
    # Tarjetas Gráficas
    "nvidia-geforce-rtx-4080-super-16gb",
    "asus-rog-strix-rtx-4070-ti-12gb-oc",
    "msi-radeon-rx-7900-xtx-gaming-trio-24gb",
    "asus-dual-rtx-4060-oc-8gb",
    "msi-geforce-rtx-4070-super-12gb-ventus-2x-oc",
    "asus-tuf-gaming-radeon-rx-7800-xt-16gb-oc",
    # Procesadores
    "amd-ryzen-7-7800x3d",
    "intel-core-i7-14700k",
    "amd-ryzen-5-7600x",
    "intel-core-i5-14600k",
    "amd-ryzen-9-7950x3d",
    "intel-core-i9-14900k",
    # Memorias RAM
    "corsair-vengeance-rgb-ddr5-32gb-6000mhz",
    "kingston-fury-beast-ddr5-32gb-6000mhz",
    "corsair-dominator-titanium-ddr5-64gb-6400mhz",
    "kingston-fury-renegade-rgb-ddr5-32gb-6400mhz",
    # Almacenamiento SSD
    "samsung-990-pro-2tb-nvme-pcie-4-0",
    "kingston-kc3000-2tb-nvme-pcie-4-0",
    "samsung-980-pro-1tb-nvme-pcie-4-0",
    "kingston-nv2-1tb-nvme-pcie-4-0",
    # Placas Madre
    "asus-rog-strix-b650-a-gaming-wifi",
    "msi-mag-b650-tomahawk-wifi",
    "asus-tuf-gaming-x670e-plus-wifi",
    # Fuentes de Poder
    "corsair-rm850x-850w-80-plus-gold-modular",
    "asus-tuf-gaming-750w-80-plus-bronze",
    "corsair-hx1000i-1000w-80-plus-platinum",
    # Gabinetes
    "corsair-4000d-airflow-tempered-glass",
    "msi-mag-forge-100r-argb",
    "asus-tuf-gaming-gt502-dual-chamber",
    # Refrigeración
    "corsair-icue-h150i-elite-lcd-xt-360mm",
    "asus-rog-ryujin-iii-360-argb",
    "msi-mag-coreliquid-240r-v2",
]

# Categorías registradas en la API
SAMPLE_CATEGORIES = [
    "tarjetas-graficas",
    "procesadores",
    "memorias-ram",
    "almacenamiento-ssd",
    "placas-madre",
    "fuentes-de-poder",
    "gabinetes",
    "refrigeracion",
]

# Marcas oficiales registradas en la API
SAMPLE_BRANDS = [
    "asus",
    "nvidia",
    "amd",
    "kingston",
    "corsair",
    "intel",
    "msi",
    "samsung",
]
