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

function agregarCarritoOferta(e) {
    const nombreProductoOferta = e.currentTarget.getAttribute('data-id');
    const productoAgregadoOferta = productos.find(producto => producto.nombre === nombreProductoOferta);
    const precioConDescuento = aplicarDescuento(productoAgregadoOferta, 15);

    let productoExistenteOferta = productosEnCarrito.find(producto => producto.nombre === nombreProductoOferta);

    // Verificamos si el producto ya está en el carrito
    if (productoExistenteOferta) {
        productoExistenteOferta.cantidad += 1;
    } else {
        productoAgregadoOferta.cantidad = 1;
        productosEnCarrito.push({ ...productoAgregadoOferta, precio: precioConDescuento });
    };

    cantidadTotal += 1;
    total = productosEnCarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);

    actualizarNumerito();
    mostrarTotalCarrito();
    mostrarNotificacion();
};

// Actualizamos la cantidad de productos en el carrito
function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
};

// Función para mostrar el precio total del carrito
function mostrarTotalCarrito() {
    totalCarrito.textContent = `Total: $${total}`;
};

// Función para abrir el carrito
function abrirCarrito() {
    modalCarrito.innerHTML = '';

    // Cambiamos el display none por flex
    modalCarrito.style.display = 'flex';

    // Creamos el contenedor del carrito
    const carritoContainer = document.createElement('div');
    carritoContainer.className = 'carritoContainer';

    // Crear y configurar el header del modal
    const modalHeader = document.createElement('header');
    const modalHeaderTitle = document.createElement('h1');
    modalHeaderTitle.innerText = 'Mi carrito';

    const botonCerrar = document.createElement('button');
    botonCerrar.className = 'cerrarModal bi bi-x-lg';
    botonCerrar.addEventListener('click', () => {
        modalCarrito.style.display = 'none';
    });

    // Agregamos el título y el botón de cerrar al header
    modalHeader.append(modalHeaderTitle, botonCerrar);

    // Contenedor de los productos en el carrito
    const modalProductosContainer = document.createElement('div');
    modalProductosContainer.className = 'carrito-productos';

    // Agregamos el header y el contenedor de productos al carrito
    carritoContainer.append(modalHeader, modalProductosContainer);

    // Verificamos si el carrito está vacío
    if (productosEnCarrito.length === 0) {
        // Si está vacío, mostramos un mensaje
        const carritoVacioMensaje = document.createElement('p');
        carritoVacioMensaje.className = 'carrito-vacio-mensaje';
        carritoVacioMensaje.innerText = 'Tu carrito está vacío.';

        const carritoVacioIcono = document.createElement('i');
        carritoVacioIcono.className = 'bi bi-emoji-frown-fill';

        carritoVacioMensaje.append(carritoVacioIcono);
        modalProductosContainer.appendChild(carritoVacioMensaje);
    } else {
        // Si el carrito no está vacío, mostramos los productos
        productosEnCarrito.forEach(producto => {
            const modalProducto = document.createElement('div');
            modalProducto.className = 'carrito-producto';

            // Imagen
            const imagenProducto = document.createElement('img');
            imagenProducto.src = producto.img[0];
            imagenProducto.alt = producto.nombre;
            imagenProducto.className = 'carrito-producto-imagen';

            // Div con el nombre
            const contenedorProductoTitulo = document.createElement('div');
            contenedorProductoTitulo.className = 'carrito-producto-titulo';

            const productoSmall = document.createElement('small');
            productoSmall.innerText = 'Producto:';
            
            const productoTitulo = document.createElement('h3');
            productoTitulo.innerText = producto.nombre;

            contenedorProductoTitulo.append(productoSmall, productoTitulo);

            // Div con la cantidad
            const contenedorProductoCantidad = document.createElement('div');
            contenedorProductoCantidad.className = 'carrito-producto-cantidad';

            const cantidadSmall = document.createElement('small');
            cantidadSmall.innerText = 'Cantidad:';

            const cantidadProducto = document.createElement('p');
            cantidadProducto.innerText = producto.cantidad;

            contenedorProductoCantidad.append(cantidadSmall, cantidadProducto);

            // Div con el precio
            const contenedorProductoPrecio = document.createElement('div');
            contenedorProductoPrecio.className = 'carrito-producto-precio';

            const precioSmall = document.createElement('small');
            precioSmall.innerText = 'Precio:';

            const precioProducto = document.createElement('p');
            precioProducto.innerText = `$${producto.precio}`;

            contenedorProductoPrecio.append(precioSmall, precioProducto);

            // Div con el subtotal
            const contenedorProductoSubtotal = document.createElement('div');
            contenedorProductoSubtotal.className = 'carrito-producto-subtotal';

            const subtotalSmall = document.createElement('small');
            subtotalSmall.innerText = 'Subtotal:';
            
            const subtotalProducto = document.createElement('p');
            subtotalProducto.innerText = `$${producto.precio * producto.cantidad}`;

            contenedorProductoSubtotal.append(subtotalSmall, subtotalProducto);

            // Botón para eliminar producto
            const eliminarProducto = document.createElement('span');
            eliminarProducto.className = 'eliminar bi bi-trash-fill';

            eliminarProducto.addEventListener('click', () => {
                quitarProducto(producto);
            });

            // Agregamos los elementos al modal
            modalProducto.append(imagenProducto, contenedorProductoTitulo, contenedorProductoCantidad, contenedorProductoPrecio, contenedorProductoSubtotal, eliminarProducto);

            modalProductosContainer.appendChild(modalProducto);
        });

        // Creamos la parte inferior del carrito con los botones solo si hay productos
        const carritoAcciones = document.createElement('div');
        carritoAcciones.className = 'carrito-acciones';

        const carritoAccionesIzquierda = document.createElement('div');
        carritoAccionesIzquierda.className = 'carrito-acciones-izquierda';

        const botonVaciar = document.createElement('button');
        botonVaciar.className = 'carrito-acciones-vaciar';
        botonVaciar.textContent = 'Vaciar carrito';

        botonVaciar.addEventListener('click', () => {
            productosEnCarrito = [];
            cantidadTotal = 0;
            total = 0;

            actualizarNumerito();
            mostrarTotalCarrito();
            abrirCarrito();
        });

        carritoAccionesIzquierda.appendChild(botonVaciar);

        // TOTAL Y BOTON COMPRAR
        const carritoAccionesDerecha = document.createElement('div');
        carritoAccionesDerecha.className = 'carrito-acciones-derecha';

        const carritoAccionesTotal = document.createElement('div');
        carritoAccionesTotal.className = 'carrito-acciones-total';
        
        const totalTextoDerecha = document.createElement('p');
        totalTextoDerecha.textContent = 'Total:';

        const totalDerecha = document.createElement('p');
        totalDerecha.textContent = `$${total}`;
        totalDerecha.setAttribute('id', 'total');

        carritoAccionesTotal.append(totalTextoDerecha, totalDerecha);

        const botonComprar = document.createElement('button');
        botonComprar.className = 'carrito-acciones-comprar';
        botonComprar.textContent = 'Comprar';

          // Evento para mostrar el modal de confirmación al hacer clic en "Comprar"
          botonComprar.addEventListener('click', () => {
            confirmarCompra();
        });

        // Agregamos todo al carritoAcciones
        carritoAccionesDerecha.append(carritoAccionesTotal, botonComprar);
        carritoAcciones.append(carritoAccionesIzquierda, carritoAccionesDerecha);

        // Añadimos las acciones al contenedor del carrito
        carritoContainer.appendChild(carritoAcciones);
    }

    // Finalmente, agregamos el carritoContainer al modal
    modalCarrito.appendChild(carritoContainer);
};

// Función para mostrar una notificación
function mostrarNotificacion() {
    const notificacionCartel = document.createElement('div');
    notificacionCartel.className = 'notificacionCartel';
    notificacionCartel.innerText = '¡Producto agregado al carrito!';

    const notificacion = document.getElementById('notificacion');
    if (!notificacion) {
        console.error('El elemento notificacion no se encontró en el DOM.');
        return;
    };

    // Eliminar notificacionCartel si ya existe
    const notificacionActual = notificacion.querySelector('.notificacionCartel');
    if (notificacionActual) {
        notificacion.removeChild(notificacionActual);
    };

    notificacion.appendChild(notificacionCartel);

    // Ocultar el cartelito después de 3 segundos
    setTimeout(() => {
        // Verificar que la notificación aún está en el DOM antes de intentar eliminarla
        if (notificacion.contains(notificacionCartel)) {
            notificacion.removeChild(notificacionCartel);
        }
    }, 3000);
};