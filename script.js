// Datos de los productos con tus imágenes y precio 0
const productos = [
    { id: 1, nombre: "Prenda 1", precio: 25.00, imagen: "img/1.png", imagenesAdicionales: ["img/1.1.png", "img/1.png"], descripcion: "Una prenda cómoda y elegante para cualquier ocasión." },
{
  id: 2,
  nombre: "jean bolsillos",
  precio: 120000,
  imagen: "img/2.png",
  imagenesAdicionales: ["img/2.1.png", "img/2.2.jpg", "img/2.3.jpg", "img/2.4.jpg", "img/2.5.jpg", "img/2.6.jpg"],
  descripcion: "Ideal para el día a día, con un diseño moderno."
},

    { id: 3, nombre: "Prenda 3", precio: 20.00, imagen: "img/3.png", imagenesAdicionales: ["img/3.1.png", "img/3.png"], descripcion: "Perfecta para un look casual y relajado." },
    { id: 4, nombre: "Prenda 4", precio: 35.00, imagen: "img/4.png", imagenesAdicionales: ["img/4.1.png", "img/4.png"], descripcion: "Diseño exclusivo con materiales de alta calidad." },
    { id: 5, nombre: "Prenda 5", precio: 28.00, imagen: "img/5.png", imagenesAdicionales: ["img/5.1.png", "img/5.png"], descripcion: "Estilo fresco y juvenil." },
    { id: 6, nombre: "Prenda 6", precio: 45.00, imagen: "img/6.png", imagenesAdicionales: ["img/6.1.png", "img/6.png"], descripcion: "Elegancia y confort en una sola prenda." }
];

// Carrito de compras: usa localStorage para persistir los datos
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

/**
 * Muestra una notificación temporal (Toast)
 * @param {string} message - El mensaje a mostrar.
 */
function mostrarToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastBody = document.getElementById('toast-body');
    if (!toast || !toastBody) return;

    toastBody.textContent = message;
    toast.classList.add('show');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Guarda y actualiza la vista del carrito en el DOM
 */
function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    const itemsCarritoDiv = document.getElementById('items-carrito');
    const totalCarritoSpan = document.getElementById('total-carrito');

    if (itemsCarritoDiv) {
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

/**
 * Agrega un producto al carrito
 */
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

/**
 * Quita un producto del carrito por su índice
 */
function quitarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

/**
 * Genera y muestra la cuadrícula de productos en index.html
 */
function mostrarProductos() {
    const productosGrid = document.getElementById('productos');
    if (!productosGrid) return;

    productosGrid.innerHTML = '';
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="product-card" onclick="window.location.href='product-detail.html?id=${producto.id}'">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-img">
                <h3 class="product-title">${producto.nombre}</h3>
                <div class="p-3 text-center">
                    <span class="product-price-list">$${producto.precio.toFixed(2)}</span>
                </div>
            </div>
        `;
        productosGrid.appendChild(card);
    });
}

/**
 * Lógica del carrusel de imágenes
 */
let currentImageIndex = 0;
let currentProduct = null;

function cambiarImagen(index) {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (currentProduct && mainImage && thumbnails.length > 0) {
        // Normaliza el índice
        if (index >= currentProduct.imagenesAdicionales.length) {
            currentImageIndex = 0;
        } else if (index < 0) {
            currentImageIndex = currentProduct.imagenesAdicionales.length - 1;
        } else {
            currentImageIndex = index;
        }

        // Cambia la imagen principal
        mainImage.src = currentProduct.imagenesAdicionales[currentImageIndex];

        // Actualiza el estado activo de las miniaturas
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
    // Inicializar la imagen principal y el estado activo
    cambiarImagen(0); 
}

/**
 * Carga el detalle del producto en product-detail.html
 */
function cargarDetalleProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1; // Default a ID 1
    
    currentProduct = productos.find(p => p.id === productId);

    if (currentProduct) {
        document.getElementById('product-title-detail').textContent = currentProduct.nombre;
        document.getElementById('product-description').textContent = currentProduct.descripcion;
        document.getElementById('product-price').textContent = `$${currentProduct.precio.toFixed(2)}`;
        
        cargarMiniaturas();

        // Configurar botones de navegación del carrusel
        document.getElementById('prev-btn').addEventListener('click', () => cambiarImagen(currentImageIndex - 1));
        document.getElementById('next-btn').addEventListener('click', () => cambiarImagen(currentImageIndex + 1));

    } else {
        document.getElementById('product-title-detail').textContent = "Producto No Encontrado";
    }

    // Eventos de compra
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
}


// =========================================================================
// LÓGICA DEL HEADER OCULTABLE EN MÓVILES (Hide on Scroll)
// =========================================================================

let lastScrollY = 0;
const header = document.querySelector('.header');
const mobileBreakpoint = 768; // Debe coincidir con el media query en CSS

function handleHeaderVisibility() {
    if (!header) return;
    
    // 1. Revisa si estamos en un tamaño móvil
    if (window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches) {
        const currentScrollY = window.scrollY;

        // 2. Si el usuario se ha desplazado más allá de la altura del header
        if (currentScrollY > header.offsetHeight) {
            // SCROLLING DOWN: Ocultar el header
            if (currentScrollY > lastScrollY) {
                header.classList.add('header-hidden');
            } 
            // SCROLLING UP: Mostrar el header
            else if (currentScrollY < lastScrollY) {
                header.classList.remove('header-hidden');
            }
        } 
        // Si estamos cerca de la parte superior, siempre mostrar
        else if (currentScrollY < 100) {
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
    } else {
        // En escritorio (header horizontal), siempre debe estar visible
        header.classList.remove('header-hidden');
    }
}


// Cargar productos y carrito al iniciar
document.addEventListener('DOMContentLoaded', () => {
    // Detectar si estamos en index.html o product-detail.html
    if (document.querySelector('.products-grid')) { // Estamos en index.html
        mostrarProductos();
    } else if (document.querySelector('.product-detail-container')) { // Estamos en product-detail.html
        cargarDetalleProducto();
    }
    actualizarCarrito(); // Asegurar que el carrito se inicialice en todas las páginas

    // Añadir listeners para la funcionalidad del header
    window.addEventListener('scroll', handleHeaderVisibility);
    window.addEventListener('resize', handleHeaderVisibility);
    handleHeaderVisibility(); // Ejecutar al inicio para asegurar el estado correcto
});