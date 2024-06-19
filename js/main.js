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