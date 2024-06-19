'use strict';

// Variables globales
let productosEnCarrito = [];
let cantidadTotal = 0;
let total = 0;

// Elementos del DOM
const contenidoShop = document.getElementById('contenidoShop');
const modalCarrito = document.getElementById('modalCarrito');
const totalCarrito = document.getElementById('totalCarrito');
const botonesCategorias = document.querySelectorAll('.boton-categoria');
const tituloPrincipal = document.getElementById('tituloPrincipal');
const numerito = document.querySelector("#numerito");
const verCarrito = document.getElementById('carrito');

// Función para cargar productos
function cargarProductos(productosElegidos) {
    contenidoShop.innerHTML = '';

    productosElegidos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('producto');

        const imagen = document.createElement('img');
        imagen.src = producto.img[0];  // Usar la primera imagen
        imagen.alt = producto.nombre;

        const h2 = document.createElement('h2');
        h2.classList.add('producto-titulo');
        h2.textContent = producto.nombre;

        const p = document.createElement('p');
        p.classList.add('producto-precio');
        p.textContent = `$${producto.precio}`;

        const botones = document.createElement('div');
        botones.classList.add('botones');

        const botonAgregar = document.createElement('button');
        botonAgregar.classList.add('producto-agregar');
        botonAgregar.setAttribute('data-id', producto.nombre);
        botonAgregar.textContent = 'Agregar';

        const bag = document.createElement('i');
        bag.classList.add('bi', 'bi-bag-plus');

        botonAgregar.prepend(bag);

        const botonVer = document.createElement('button');
        botonVer.classList.add('producto-ver');
        botonVer.setAttribute('data-id', producto.nombre);
        botonVer.textContent = 'Ver';

        botones.append(botonAgregar, botonVer);

        card.append(imagen, h2, p, botones);

        contenidoShop.appendChild(card);
    });

    actualizarBotonesAgregar();
    actualizarBotonesVer();
};

cargarProductos(productos);

// Actualizar botones con evento

// Botón agregar al carrito
function actualizarBotonesAgregar() {
    const botonesAgregar = document.querySelectorAll('.producto-agregar');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarCarrito);
        
    });
};

// Botón ver más (modal)
function actualizarBotonesVer() {
    const botonesVer = document.querySelectorAll('.producto-ver');
    botonesVer.forEach(boton => {
        boton.addEventListener('click', verProducto);
    });
};

// Botón Carrito
function actualizarBotonCarrito() {
    verCarrito.addEventListener('click', abrirCarrito);
};

// Llamamos a la función para actualizar el botón del carrito
actualizarBotonCarrito();

// Función que crea la ventana modal para ver más detalles del producto
function verProducto(e) {
    const nombreProducto = e.currentTarget.getAttribute('data-id');
    const producto = productos.find(producto => producto.nombre === nombreProducto);

    // Creación de la modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modalContainer';

    const modalContent = document.createElement('div');
    modalContent.className = 'modalContent';

    // Botón para cerrar el modal
    const botonCerrar = document.createElement('button');
    botonCerrar.className = 'cerrarModal bi bi-x-lg';
    botonCerrar.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });

    // Slider de imágenes
    const slider = document.createElement('div');
    slider.className = 'slider';

    producto.img.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = producto.nombre;
        slider.appendChild(img);
    });

    // Botones de navegación
    const prevButton = document.createElement('button');
    prevButton.className = 'slider-button prev';
    prevButton.innerHTML = '<i class="bi bi-chevron-left"></i>';
    prevButton.addEventListener('click', () => changeImage(slider, -1));

    const nextButton = document.createElement('button');
    nextButton.className = 'slider-button next';
    nextButton.innerHTML = '<i class="bi bi-chevron-right"></i>';
    nextButton.addEventListener('click', () => changeImage(slider, 1));

    slider.appendChild(prevButton);
    slider.appendChild(nextButton);

    // Elementos del producto
    const nombreProductoElemento = document.createElement('h2');
    nombreProductoElemento.classList.add('producto-titulo');
    nombreProductoElemento.innerText = producto.nombre;

    const descripcionProducto = document.createElement('p');
    descripcionProducto.classList.add('descripcion-producto');
    descripcionProducto.innerText = producto.descripcion;

    const precioProducto = document.createElement('p');
    precioProducto.innerText = `$${producto.precio}`;
    precioProducto.classList.add('producto-precio');

    const botonAgregar = document.createElement('button');
    botonAgregar.classList.add('producto-agregar');
    botonAgregar.setAttribute('data-id', producto.nombre);
    botonAgregar.textContent = 'Agregar';
    botonAgregar.addEventListener('click', agregarCarrito);

    const bag = document.createElement('i');
    bag.classList.add('bi', 'bi-bag-plus');

    // Armado de la modal
    botonAgregar.prepend(bag);

    modalContent.append(botonCerrar, slider, nombreProductoElemento, descripcionProducto, precioProducto, botonAgregar);

    modalContainer.appendChild(modalContent);

    document.body.appendChild(modalContainer);

    // Iniciar slider
    iniciarSlider(slider);
};

// Creamos Slider para las imágenes

function changeImage(slider, direction) {
    const images = slider.querySelectorAll('img');
    let index = Array.from(images).findIndex(img => img.style.display === 'block');

    images[index].style.display = 'none';
    index = (index + direction + images.length) % images.length;
    images[index].style.display = 'block';
};

function iniciarSlider(slider) {
    const images = slider.querySelectorAll('img');
    images.forEach((img, i) => {
        img.style.display = i === 0 ? 'block' : 'none';
    });
};

// Función para agregar productos al carrito

function agregarCarrito(e) {
    const nombreProducto = e.currentTarget.getAttribute('data-id');
    const productoAgregado = productos.find(producto => producto.nombre === nombreProducto);

    let productoExistente = productosEnCarrito.find(producto => producto.nombre === nombreProducto);

    // Verificamos si el producto ya está en el carrito
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push({ ...productoAgregado });
    };

    cantidadTotal += 1;
    total = productosEnCarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);

    actualizarNumerito();
    mostrarTotalCarrito();
    mostrarNotificacion();
};