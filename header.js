const headerHTML = `
<header class="header">
    <img src="img/logo 2.png" alt="Logo" class="logo">
    <nav>
        <ul class="nav-menu">
            <li><a class="nav-link" href="index.html">Inicio</a></li>
            <li><a class="nav-link" href="productos.html">Productos</a></li>
            <li><a class="nav-link" href="nosotros.html">Nosotros</a></li>
            <li><a class="nav-link" href="contactanos.html">Contacto</a></li>
        </ul>
    </nav>
    <div class="search-container">
        <input type="text" class="search-input" placeholder="Buscar productos...">
        <button class="search-button">Buscar</button>
    </div>
</header>
`;

function injectHeader() {
    const placeholder = document.getElementById('header-placeholder');
    if (placeholder) {
        placeholder.innerHTML = headerHTML;
    }
}

let lastScrollY_header = 0;
const mobileBreakpoint_header = 768; 

function handleHeaderVisibility() {
    const header = document.querySelector('.header'); 
    if (!header) return;
    
    if (window.matchMedia(`(max-width: ${mobileBreakpoint_header}px)`).matches) {
        const currentScrollY = window.scrollY;
        if (currentScrollY > header.offsetHeight) {
            if (currentScrollY > lastScrollY_header) {
                header.classList.add('header-hidden');
            } else if (currentScrollY < lastScrollY_header) {
                header.classList.remove('header-hidden');
            }
        } else if (currentScrollY < 100) {
            header.classList.remove('header-hidden');
        }
        lastScrollY_header = currentScrollY;
    } else {
        header.classList.remove('header-hidden');
    }
}

function highlighActiveLink() {
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    let currentPage = window.location.pathname.split('/').pop();

    if (currentPage === '') currentPage = 'index.html';

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        
        if (linkPage === 'productos.html' && (currentPage === 'productos.html' || currentPage === 'product-detail.html')) {
            link.classList.add('active-nav-link');
        } 
       
        else if (linkPage === currentPage) {
            link.classList.add('active-nav-link');
        }
    });
}

injectHeader();

document.addEventListener('DOMContentLoaded', () => {
    highlighActiveLink();
    window.addEventListener('scroll', handleHeaderVisibility);
    window.addEventListener('resize', handleHeaderVisibility);
    handleHeaderVisibility(); 
});