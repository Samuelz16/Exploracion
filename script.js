// Datos de los productos con tus imágenes y precio 0
const productos = [
    { id: 1, nombre: "Prenda 1", precio: 25.00, imagen: "img/1.png", imagenesAdicionales: ["img/1.1.png", "img/1.png"], descripcion: "Una prenda cómoda y elegante para cualquier ocasión." },
    { id: 3, nombre: "Prenda 2", precio: 30.00, imagen: "img/2.png", imagenesAdicionales: ["img/2.1.png", "img/2.png"], descripcion: "Ideal para el día a día, con un diseño moderno." },
    { id: 5, nombre: "Prenda 3", precio: 20.00, imagen: "img/3.png", imagenesAdicionales: ["img/3.1.png", "img/3.png"], descripcion: "Perfecta para un look casual y relajado." },
    { id: 6, nombre: "Prenda 4", precio: 35.00, imagen: "img/4.png", imagenesAdicionales: ["img/4.1.png", "img/4.png"], descripcion: "Diseño exclusivo con materiales de alta calidad." },
    { id: 7, nombre: "Prenda 5", precio: 28.00, imagen: "img/7.png", imagenesAdicionales: ["img/7.1.png", "img/7.png"], descripcion: "Versátil y fácil de combinar, un básico en tu armario." },
    { id: 9, nombre: "Prenda 6", precio: 40.00, imagen: "img/8.jpg", imagenesAdicionales: ["img/8.1.jpg", "img/8.jpg"], descripcion: "Estilo único y confort garantizado." },
    // { id: 10, nombre: "Prenda 7", precio: 22.00, imagen: "img/13.png", imagenesAdicionales: ["img/13.1.png", "img/13.png"], descripcion: "Novedad de temporada, no te quedes sin ella." }, // Asumiendo que img/13.png y 13.1.png existen
];

// Carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para mostrar productos en index.html
function mostrarProductos() {
    const productosContainer = document.querySelector('.products-grid');
    if (!productosContainer) return; // Asegurarse de que estamos en index.html

    productosContainer.innerHTML = '';

    productos.forEach(producto => {
        const productoElement = document.createElement('a'); // Cambiado a <a>
        productoElement.href = `product-detail.html?id=${producto.id}`; // Enlace a la página de detalle
        productoElement.className = 'product-card';
        productoElement.innerHTML = `
            <div class="product-img">
                <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/250/800040/FFFFFF?text=${producto.nombre}'">
            </div>
            <div class="product-title">${producto.nombre}</div>
            <button class="btn add-to-cart-btn" onclick="event.preventDefault(); agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
        productosContainer.appendChild(productoElement);
    });
}

// Función para agregar al carrito (ahora puede recibir talla y cantidad)
function agregarAlCarrito(productoId, talla = 'N/A', cantidad = 1) {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
        const itemCarrito = {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            talla: talla,
            cantidad: cantidad
        };
        carrito.push(itemCarrito);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
        alert(`${cantidad}x ${producto.nombre} (Talla: ${talla}) agregado al carrito`);
    }
}

// Función para actualizar el carrito
function actualizarCarrito() {
    const itemsCarrito = document.getElementById('items-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    if (!itemsCarrito || !totalCarrito) return; // Asegurarse de que estamos en index.html

    itemsCarrito.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        itemsCarrito.innerHTML = '<p style="text-align: center; color: #5a1f3e;">El carrito está vacío</p>';
    } else {
        carrito.forEach((item, index) => {
            const productoElement = document.createElement('div');
            productoElement.className = 'producto-carrito';
            productoElement.innerHTML = `
                <span>${item.nombre} (T: ${item.talla}, Cant: ${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}</span>
                <button onclick="eliminarDelCarrito(${index})"><i class="fas fa-trash"></i></button>
            `;
            itemsCarrito.appendChild(productoElement);
            total += item.precio * item.cantidad;
        });
    }

    totalCarrito.textContent = total.toFixed(2);
}

// Función para eliminar del carrito
function eliminarDelCarrito(index) {
    const productoEliminado = carrito[index];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    alert(`${productoEliminado.nombre} eliminado del carrito`);
}

// Función para proceder con el pago
document.addEventListener('DOMContentLoaded', () => {
    const procederPagoBtn = document.getElementById('proceder-pago');
    if (procederPagoBtn) { // Solo si estamos en index.html
        procederPagoBtn.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('El carrito está vacío. Agrega productos antes de proceder.');
                return;
            }

            const mensaje = carrito.map(item =>
                `- ${item.cantidad}x ${item.nombre} (Talla: ${item.talla})`
            ).join('\n');

            const numeroWhatsApp = '+573154154446';
            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
                `Hola, quiero información sobre los siguientes productos:\n${mensaje}\nTotal: $${document.getElementById('total-carrito').textContent}`
            )}`;

            window.open(url, '_blank');
        });
    }
});


// --- Lógica específica para product-detail.html ---

let currentProduct = null; // Variable para almacenar el producto actual en la página de detalle
let currentImageIndex = 0; // Para el slider de imágenes

function cargarDetalleProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (isNaN(productId)) {
        // Redirigir o mostrar un mensaje de error si no hay ID válido
        document.querySelector('.product-detail-container').innerHTML = '<p style="text-align: center; font-size: 1.2em; color: #e74c3c;">Producto no encontrado. Vuelve a la <a href="index.html" style="color: #800040; text-decoration: none;">página principal</a>.</p>';
        return;
    }

    currentProduct = productos.find(p => p.id === productId);

    if (!currentProduct) {
        document.querySelector('.product-detail-container').innerHTML = '<p style="text-align: center; font-size: 1.2em; color: #e74c3c;">Producto no encontrado. Vuelve a la <a href="index.html" style="color: #800040; text-decoration: none;">página principal</a>.</p>';
        return;
    }

    // Actualizar elementos de la página de detalle
    document.getElementById('product-title-detail').textContent = currentProduct.nombre;
    document.getElementById('product-description').textContent = currentProduct.descripcion;
    document.getElementById('product-price').textContent = `Precio: $${currentProduct.precio.toFixed(2)}`;

    // Slider de imágenes
    const mainImage = document.getElementById('main-image');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const allImages = [currentProduct.imagen, ...(currentProduct.imagenesAdicionales || [])];

    mainImage.src = allImages[0]; // Mostrar la primera imagen por defecto

    thumbnailContainer.innerHTML = ''; // Limpiar miniaturas existentes
    allImages.forEach((imgSrc, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = imgSrc;
        thumbnail.alt = `${currentProduct.nombre} - Vista ${index + 1}`;
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.dataset.index = index;
        thumbnail.addEventListener('click', () => {
            mainImage.src = imgSrc;
            currentImageIndex = index;
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        thumbnailContainer.appendChild(thumbnail);
    });

    // Eventos para botones de navegación del slider
    document.getElementById('prev-btn').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
        mainImage.src = allImages[currentImageIndex];
        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
        document.querySelector(`.thumbnail[data-index="${currentImageIndex}"]`).classList.add('active');
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % allImages.length;
        mainImage.src = allImages[currentImageIndex];
        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
        document.querySelector(`.thumbnail[data-index="${currentImageIndex}"]`).classList.add('active');
    });

    // Eventos para "Agregar al Carrito" y "Comprar Ahora"
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


// Cargar productos y carrito al iniciar
document.addEventListener('DOMContentLoaded', () => {
    // Detectar si estamos en index.html o product-detail.html
    if (document.querySelector('.products-grid')) { // Estamos en index.html
        mostrarProductos();
        actualizarCarrito();
    } else if (document.querySelector('.product-detail-container')) { // Estamos en product-detail.html
        cargarDetalleProducto();
    }
    actualizarCarrito(); // Asegurarse de que el carrito se actualice en ambas páginas si es visible
});