"""
NexusHardware — Suite Principal de Pruebas de Carga con Locust
Simula el comportamiento realista de usuarios en un e-commerce de hardware:
navegación del catálogo, búsquedas con filtros, consulta de fichas técnicas,
autenticación JWT y checkout transaccional con Webpay Plus.
"""

import random
from locust import HttpUser, task, between, events
from config import (
    BASE_USER,
    SEARCH_TERMS,
    SAMPLE_SLUGS,
    SAMPLE_CATEGORIES,
    SAMPLE_BRANDS,
)


class NexusEcommerceUser(HttpUser):
    """
    Simulación de cliente navegante y comprador en NexusHardware.
    Implementa un 'think time' humano entre 1.0 y 3.0 segundos.
    """
    wait_time = between(1.0, 3.0)
    token = None

    def on_start(self):
        """
        Al iniciar cada usuario virtual:
        Aproximadamente el 30% de los usuarios inician sesión al ingresar a la tienda.
        El resto navega como visitante anónimo y se autentica solo si decide comprar.
        """
        if random.random() < 0.30:
            self.login()

    def login(self):
        """
        Autenticación contra la API REST mediante JWT (/api/auth/login).
        """
        payload = {
            "email": BASE_USER["email"],
            "password": BASE_USER["password"],
        }
        with self.client.post(
            "/api/auth/login",
            json=payload,
            catch_response=True,
            name="/api/auth/login",
        ) as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    self.token = data.get("token")
                    response.success()
                except Exception as e:
                    response.failure(f"Fallo al parsear respuesta JSON de login: {e}")
            else:
                response.failure(
                    f"Fallo en login con status {response.status_code}: {response.text}"
                )

    # ─── 1. NAVEGACIÓN Y DESCUBRIMIENTO (Tráfico Mayoritario) ──────────────

    @task(28)
    def browse_catalog(self):
        """
        Navega por el catálogo de productos con paginación aleatoria.
        Endpoint: GET /api/products?page=N&limit=12
        """
        page = random.randint(1, 4)
        self.client.get(
            f"/api/products?page={page}&limit=12",
            name="/api/products (catálogo paginado)",
        )

    @task(18)
    def search_hardware(self):
        """
        Realiza búsquedas textuales insensibles a mayúsculas por marcas o modelos.
        Endpoint: GET /api/products?search=termino
        """
        query = random.choice(SEARCH_TERMS)
        self.client.get(
            f"/api/products?search={query}",
            name="/api/products?search=[término]",
        )

    @task(14)
    def filter_by_category_or_brand(self):
        """
        Aplica filtros relacionales de categoría o marca oficial.
        """
        if random.random() < 0.5:
            cat = random.choice(SAMPLE_CATEGORIES)
            self.client.get(
                f"/api/products?category={cat}",
                name="/api/products?category=[categoría]",
            )
        else:
            brand = random.choice(SAMPLE_BRANDS)
            self.client.get(
                f"/api/products?brand={brand}",
                name="/api/products?brand=[marca]",
            )

    @task(10)
    def view_taxonomies(self):
        """
        Carga las marcas y categorías oficiales para poblar el menú y footer.
        Endpoints: GET /api/categories y GET /api/brands
        """
        self.client.get("/api/categories", name="/api/categories")
        self.client.get("/api/brands", name="/api/brands")

    # ─── 2. DETALLE Y ESPECIFICACIONES TÉCNICAS ──────────────────────────

    @task(22)
    def view_product_detail(self):
        """
        Consulta la ficha técnica completa de un componente por su slug.
        Endpoint: GET /api/products/:slug (Prisma + JSON de specs)
        """
        slug = random.choice(SAMPLE_SLUGS)
        with self.client.get(
            f"/api/products/{slug}",
            catch_response=True,
            name="/api/products/[slug]",
        ) as response:
            if response.status_code == 200:
                response.success()
            elif response.status_code == 404:
                response.failure(f"Producto slug '{slug}' no encontrado en DB")
            else:
                response.failure(f"Error {response.status_code} al consultar producto")

    # ─── 3. PERFIL E HISTORIAL DE CLIENTE ────────────────────────────────

    @task(5)
    def check_user_profile(self):
        """
        Consulta el perfil y el historial de compras del usuario autenticado.
        Endpoints: GET /api/auth/me y GET /api/orders/my-orders
        """
        if not self.token:
            self.login()
        if not self.token:
            return

        headers = {"Authorization": f"Bearer {self.token}"}
        self.client.get("/api/auth/me", headers=headers, name="/api/auth/me")
        self.client.get(
            "/api/orders/my-orders",
            headers=headers,
            name="/api/orders/my-orders",
        )

    # ─── 4. CHECKOUT TRANSACCIONAL (Transbank Sandbox) ────────────────────

    @task(3)
    def checkout_order(self):
        """
        Simula la compra transaccional del carrito con descuento atómico de stock.
        Endpoint: POST /api/orders
        """
        if not self.token:
            self.login()
        if not self.token:
            return

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

        # Genera una orden de 1 a 2 productos aleatorios del catálogo (IDs 1 al 48)
        num_items = random.randint(1, 2)
        product_ids = random.sample(range(1, 49), num_items)
        items = [{"productId": pid, "quantity": 1} for pid in product_ids]

        payload = {
            "items": items,
            "shippingAddress": {
                "fullName": "Cliente UTEM Evaluación",
                "rut": "18.765.432-1",
                "phone": "+56987654321",
                "address": "Dieciocho 161",
                "commune": "Santiago Centro",
            },
            "paymentMethod": "WEBPAY",
        }

        with self.client.post(
            "/api/orders",
            json=payload,
            headers=headers,
            catch_response=True,
            name="/api/orders (checkout)",
        ) as response:
            if response.status_code in (200, 201):
                response.success()
            elif response.status_code == 400:
                # Si el stock se agota debido al alto volumen de pruebas concurrentes,
                # la transacción de Prisma protegió correctamente la base de datos (comportamiento esperado).
                res_data = response.json() if response.text else {}
                msg = res_data.get("message", "")
                if "stock" in msg.lower():
                    response.success()
                else:
                    response.failure(f"Rechazo de orden: {msg}")
            else:
                response.failure(
                    f"Error de checkout status {response.status_code}: {response.text}"
                )
