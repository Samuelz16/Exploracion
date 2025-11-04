// --- DATOS DE PRODUCTOS ---
// Productos 1, 2 y 3 están marcados como "destacado: true"
const productos = [
    { 
      id: 1, 
      nombre: "Prenda 1", 
      precio: 25.00, 
      imagen: "img/1.png", 
      imagenesAdicionales: ["img/1.1.png", "img/1.png"], 
      descripcion: "Una prenda cómoda y elegante para cualquier ocasión.",
      destacado: true // <--- AÑADIDO
    },
    {
      id: 2,
      nombre: "jean bolsillos",
      precio: 120000,
      imagen: "img/2.png",
      imagenesAdicionales: ["img/2.1.png", "img/2.2.jpg", "img/2.3.jpg", "img/2.4.jpg", "img/2.5.jpg", "img/2.6.jpg"],
      descripcion: "Ideal para el día a día, con un diseño moderno.",
      destacado: true // <--- MANTENIDO
    },
    { 
      id: 3, 
      nombre: "Prenda 3", 
      precio: 20.00, 
      imagen: "img/3.png", 
      imagenesAdicionales: ["img/3.1.png", "img/3.png"], 
      descripcion: "Perfecta para un look casual y relajado.",
      destacado: true // <--- AÑADIDO
    },
    { 
      id: 4, 
      nombre: "Prenda 4", 
      precio: 35.00, 
      imagen: "img/4.png", 
      imagenesAdicionales: ["img/4.1.png", "img/4.png"], 
      descripcion: "Diseño exclusivo con materiales de alta calidad."
      // "destacado: true" ha sido eliminado
    },
    { id: 5, nombre: "Prenda 5", precio: 28.00, imagen: "img/5.png", imagenesAdicionales: ["img/5.1.png", "img/5.png"], descripcion: "Estilo fresco y juvenil." },
    { 
      id: 6, 
      nombre: "Prenda 6", 
      precio: 45.00, 
      imagen: "img/6.png", 
      imagenesAdicionales: ["img/6.1.png", "img/6.png"], 
      descripcion: "Elegancia y confort en una sola prenda."
      // "destacado: true" ha sido eliminado
    }
];

// --- CARRITO DE COMPRAS ---
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function mostrarToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastBody = document.getElementById('toast-body');
    if (!toast || !toastBody) return;

    toastBody.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    const itemsCarritoDiv = document.getElementById('items-carrito');
    const totalCarritoSpan = document.getElementById('total-carrito');

    if (itemsCarritoDiv) { // Solo actualiza si el carrito existe en la página
        itemsCarritoDiv.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            itemsCarritoDiv.innerHTML = '<p class="text-center mt-3">El carrito está vacío.</p>';
        } else {
            carrito.forEach((item, index) => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;

                const itemDiv = document.createElement('div');
                itemDiv.className = 'producto-carrito';
                itemDiv.innerHTML = `
                    <span>${item.cantidad}x ${item.nombre} (T: ${item.talla})</span>
                    <span>$${subtotal.toFixed(2)} 
                        <button class="btn btn-sm btn-danger ms-2" onclick="quitarDelCarrito(${index})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </span>
                `;
                itemsCarritoDiv.appendChild(itemDiv);
            });
        }
        if (totalCarritoSpan) {
            totalCarritoSpan.textContent = total.toFixed(2);
        }
    }
}

function agregarAlCarrito(id, talla, cantidad) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const itemExistente = carrito.find(item => item.id === id && item.talla === talla);

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            talla: talla,
            cantidad: cantidad
        });
    }
    actualizarCarrito();
    mostrarToast(`¡${producto.nombre} (T:${talla}) agregado!`);
}

function quitarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

// --- RENDERIZADO DE PRODUCTOS ---

/**
 * Genera el HTML de una tarjeta de producto
 */
function crearTarjetaProductoHTML(producto) {
    return `
        <div class="col">
            <div class="product-card" onclick="window.location.href='product-detail.html?id=${producto.id}'">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-img">
                <h3 class="product-title">${producto.nombre}</h3>
                <div class="p-3 text-center">
                    <span class="product-price-list">$${producto.precio.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Muestra TODOS los productos en productos.html
 */
function mostrarTodosProductos() {
    const productosGrid = document.getElementById('productos-grid-todos');
    if (!productosGrid) return;

    productosGrid.innerHTML = '';
    productos.forEach(producto => {
        productosGrid.innerHTML += crearTarjetaProductoHTML(producto);
    });
}

/**
 * Muestra SOLO productos destacados en index.html
 */
function mostrarProductosDestacados() {
    const productosDestacadosGrid = document.getElementById('productos-destacados');
    if (!productosDestacadosGrid) return;

    productosDestacadosGrid.innerHTML = '';
    const destacados = productos.filter(p => p.destacado === true);
    
    destacados.forEach(producto => {
        productosDestacadosGrid.innerHTML += crearTarjetaProductoHTML(producto);
    });
}


// --- DETALLE DE PRODUCTO (product-detail.html) ---

let currentImageIndex = 0;
let currentProduct = null;

function cambiarImagen(index) {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (currentProduct && mainImage && thumbnails.length > 0) {
        if (index >= currentProduct.imagenesAdicionales.length) {
            currentImageIndex = 0;
        } else if (index < 0) {
            currentImageIndex = currentProduct.imagenesAdicionales.length - 1;
        } else {
            currentImageIndex = index;
        }
        mainImage.src = currentProduct.imagenesAdicionales[currentImageIndex];
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentImageIndex);
        });
    }
}

function cargarMiniaturas() {
    const thumbnailContainer = document.getElementById('thumbnail-container');
    if (!currentProduct || !thumbnailContainer) return;

    thumbnailContainer.innerHTML = '';
    currentProduct.imagenesAdicionales.forEach((imgSrc, index) => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.alt = `Vista ${index + 1}`;
        thumb.className = 'thumbnail';
        thumb.addEventListener('click', () => cambiarImagen(index));
        thumbnailContainer.appendChild(thumb);
    });
    cambiarImagen(0); 
}

function cargarDetalleProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    currentProduct = productos.find(p => p.id === productId);

    if (currentProduct) {
        document.getElementById('product-title-detail').textContent = currentProduct.nombre;
        document.getElementById('product-description').textContent = currentProduct.descripcion;
        document.getElementById('product-price').textContent = `$${currentProduct.precio.toFixed(2)}`;
        cargarMiniaturas();

        document.getElementById('prev-btn').addEventListener('click', () => cambiarImagen(currentImageIndex - 1));
        document.getElementById('next-btn').addEventListener('click', () => cambiarImagen(currentImageIndex + 1));

        document.getElementById('add-to-cart').addEventListener('click', () => {
            const selectedSize = document.getElementById('size').value;
            const quantity = parseInt(document.getElementById('quantity').value);
            agregarAlCarrito(currentProduct.id, selectedSize, quantity);
        });

        document.getElementById('buy-now').addEventListener('click', () => {
            const selectedSize = document.getElementById('size').value;
            const quantity = parseInt(document.getElementById('quantity').value);
            const item = {
                nombre: currentProduct.nombre,
                talla: selectedSize,
                cantidad: quantity,
                precio: currentProduct.precio
            };
            const mensaje = `- ${item.cantidad}x ${item.nombre} (Talla: ${item.talla})\nTotal: $${(item.precio * item.cantidad).toFixed(2)}`;
            const numeroWhatsApp = '+573154154446';
            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
                `Hola, quiero comprar el siguiente producto:\n${mensaje}`
            )}`;
            window.open(url, '_blank');
        });
    } else {
        document.getElementById('product-title-detail').textContent = "Producto No Encontrado";
    }
}


// --- LÓGICA DEL HEADER (Ocultar en scroll) ---

let lastScrollY = 0;
const header = document.querySelector('.header');
const mobileBreakpoint = 768; 

function handleHeaderVisibility() {
    if (!header) return;
    
    if (window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches) {
        const currentScrollY = window.scrollY;
        if (currentScrollY > header.offsetHeight) {
            if (currentScrollY > lastScrollY) {
                header.classList.add('header-hidden');
            } else if (currentScrollY < lastScrollY) {
                header.classList.remove('header-hidden');
            }
        } else if (currentScrollY < 100) {
            header.classList.remove('header-hidden');
        }
        lastScrollY = currentScrollY;
    } else {
        header.classList.remove('header-hidden');
    }
}

// =========================================================================
// INICIALIZACIÓN (Al cargar la página)
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA PARA RESALTAR ENLACE ACTIVO (Actualizada) ---
    function highlighActiveLink() {
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');
        let currentPage = window.location.pathname.split('/').pop();

        if (currentPage === '') currentPage = 'index.html';

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            
            // Caso especial: Resaltar "Productos" también en la página de detalle
            if (linkPage === 'productos.html' && (currentPage === 'productos.html' || currentPage === 'product-detail.html')) {
                link.classList.add('active-nav-link');
            } 
            // Caso general
            else if (linkPage === currentPage) {
                link.classList.add('active-nav-link');
            }
        });
    }
    highlighActiveLink();

    // --- Cargar productos según la página ---
    if (document.getElementById('productos-grid-todos')) { // Estamos en productos.html
        mostrarTodosProductos();
    } else if (document.getElementById('productos-destacados')) { // Estamos en index.html
        mostrarProductosDestacados();
    } else if (document.querySelector('.product-detail-container')) { // Estamos en product-detail.html
        cargarDetalleProducto();
    }

    // Inicializar carrito (siempre)
    actualizarCarrito();

    // --- LÓGICA DEL BOTÓN DE PAGO (Carrito) ---
    const botonPagar = document.getElementById('proceder-pago');
    
    if (botonPagar) { // Solo se ejecutará si el botón existe (en productos.html)
        botonPagar.addEventListener('click', () => {
            if (carrito.length === 0) {
                mostrarToast('El carrito está vacío.');
                return; 
            }
            const numeroWhatsApp = '+573154154446';
            let mensaje = 'Hola CAPAZ, quiero proceder con el pago de mi carrito:\n\n';
            let total = 0;
            carrito.forEach(item => {
                const subtotal = item.precio * item.cantidad;
                mensaje += `- ${item.cantidad}x ${item.nombre} (Talla: ${item.talla})\n`;
                total += subtotal;
            });
            mensaje += `\n*Total del Pedido: $${total.toFixed(2)}*`;
            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        });
    }

    // --- Listeners para el Header ---
    window.addEventListener('scroll', handleHeaderVisibility);
    window.addEventListener('resize', handleHeaderVisibility);
    handleHeaderVisibility(); 
});