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

// Función confirmar compra
function confirmarCompra() {
    // Crear modal
    const modalConfirmacion = document.createElement('div');
    modalConfirmacion.className = 'modal-confirmacion-compra';

    // Crear el cuerpo del modal
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body confirmacion-compra';

    const modalTitle = document.createElement('h2');
    modalTitle.className = 'modal-title';
    modalTitle.innerHTML = 'Finalizar compra';

    const modalSubtitle = document.createElement('h3');
    modalSubtitle.className = 'modal-subtitle';
    modalSubtitle.innerHTML = 'Ingresá tus datos para continuar con la compra';

    // Crear formulario de compra
    const form = document.createElement('form');

    // Validación al enviar el formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Validación de campos
        const nombre = document.querySelector("#nombre");
        const apellido = document.querySelector("#apellido");
        const telefono = document.querySelector("#telefono");
        const email = document.querySelector("#email");
        const fechaEntrega = document.querySelector("#fechaEntrega");
        const direccionEntrega = document.querySelector("#direccionEntrega");
        const metodoPago = document.querySelector("#metodoPago");

        let sinErrores = true;

        // Borrar mensajes de error anteriores
        document.querySelectorAll('.mensaje-error').forEach(el => el.remove());

        [nombre, apellido, telefono, email, fechaEntrega, direccionEntrega, metodoPago].forEach(campo => {
            if (campo.value.trim() === '') {
                sinErrores = false;
                campo.classList.add('is-invalid');

                // Crear y mostrar mensaje de error
                const errorMessage = document.createElement('span');
                errorMessage.className = 'mensaje-error';
                errorMessage.textContent = `${campo.placeholder} es obligatorio`;
                campo.parentElement.appendChild(errorMessage);
            } else {
                campo.classList.remove('is-invalid');
                campo.classList.add('is-valid');
            }
        });

        // Si no hay errores, se procede a finalizar la compra
        if (sinErrores) {
            // Vaciar el modal y mostrar mensaje de éxito
            modalBody.innerHTML = '';
            
            const mensajeExitoContenedor = document.createElement('div');
            mensajeExitoContenedor.className = 'mensaje-exito-contenedor';

            const logoMundo = document.createElement('img');
            logoMundo.src = 'img/logo.png';
            logoMundo.alt = 'Logo Mundo Urbano';

            const mensajeExito = document.createElement('p');
            mensajeExito.textContent = 'Compra finalizada exitosamente. ¡Gracias por tu compra!';
            mensajeExito.className = 'mensaje-exito';
            // Botón de cerrar modal
            const botonCerrar = document.createElement('button');
            botonCerrar.className = 'boton-cerrar-modal';
            botonCerrar.textContent = 'Volver a la tienda';
            botonCerrar.addEventListener('click', () => {
                modalConfirmacion.remove();
            });

            mensajeExitoContenedor.append(logoMundo, mensajeExito, botonCerrar);

            modalBody.append(mensajeExitoContenedor);
            
            // Limpiar carrito
            productosEnCarrito = [];
            cantidadTotal = 0;
            total = 0;
            actualizarNumerito();
            mostrarTotalCarrito();
            abrirCarrito();
        }
    });

    // Campos del formulario
    const crearCampoFormulario = (id, type, label) => {
        const divContenedorForm = document.createElement('div');
        divContenedorForm.className = 'contendor-form';

        const input = document.createElement('input');
        input.setAttribute('type', type);
        input.className = 'form-control';
        input.setAttribute('name', id);
        input.setAttribute('id', id);
        input.setAttribute('placeholder', label);

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', id);
        labelElement.textContent = label;

        divContenedorForm.append(input, labelElement);
        return divContenedorForm;
    };

    // Crear y agregar campos al formulario
    const nombreCampo = crearCampoFormulario('nombre', 'text', 'Nombre');
    const apellidoCampo = crearCampoFormulario('apellido', 'text', 'Apellido');
    const telefonoCampo = crearCampoFormulario('telefono', 'tel', 'Teléfono');
    const emailCampo = crearCampoFormulario('email', 'email', 'Correo electrónico');
    const fechaEntregaCampo = crearCampoFormulario('fechaEntrega', 'date', 'Fecha de entrega');
    const direccionEntregaCampo = crearCampoFormulario('direccionEntrega', 'text', 'Dirección de entrega');

    // Crear contenedor para los campos de nombre y apellido
    const datosUsuario = document.createElement('div');
    datosUsuario.className = 'datos-usuario';

    // Añadir los campos de nombre y apellido al contenedor
    datosUsuario.append(nombreCampo, apellidoCampo);

    // Campo método de pago (diferente porque es un select)
    const metodoPagoDiv = document.createElement('div');
    metodoPagoDiv.className = 'metodo-pago-div';

    const metodoPagoSelect = document.createElement('select');
    metodoPagoSelect.className = 'form-select';
    metodoPagoSelect.setAttribute('name', 'metodoPago');
    metodoPagoSelect.setAttribute('id', 'metodoPago');

    const labelMetodoPago = document.createElement('label');
    labelMetodoPago.setAttribute('for', 'metodoPago');
    labelMetodoPago.textContent = 'Método de pago';

    // Opciones para el método de pago
    const opcionesPago = [
        { valor: 'efectivo', texto: 'Efectivo' },
        { valor: 'tarjeta', texto: 'Tarjeta de crédito/débito' },
        { valor: 'mercadoPago', texto: 'Mercado Pago' }
    ];

    opcionesPago.forEach(opcion => {
        const opcionElemento = document.createElement('option');
        opcionElemento.value = opcion.valor;
        opcionElemento.textContent = opcion.texto;
        metodoPagoSelect.appendChild(opcionElemento);
    });

    metodoPagoDiv.append(labelMetodoPago, metodoPagoSelect);

    // Botones del formulario
    const divBotones = document.createElement('div');
    divBotones.className = 'div-buttons-confirmacion';

    const botonFinalizar = document.createElement('button');
    botonFinalizar.setAttribute('type', 'submit');
    botonFinalizar.className = 'boton-compra-finalizada';
    botonFinalizar.textContent = 'Finalizar compra';

    const botonCancelar = document.createElement('button');
    botonCancelar.className = 'boton-cancelar-compra';
    botonCancelar.textContent = 'Cancelar';
    botonCancelar.addEventListener('click', () => {
        modalConfirmacion.remove();
    });

    divBotones.append(botonFinalizar, botonCancelar);

    // Agregar todos los elementos al formulario
    form.append(datosUsuario, telefonoCampo, emailCampo, fechaEntregaCampo, direccionEntregaCampo, metodoPagoDiv, divBotones);

    // Agregar todo al cuerpo del modal
    modalBody.append(modalTitle, modalSubtitle, form);
    modalConfirmacion.append(modalBody);

    // Agregar el modal al body
    document.body.appendChild(modalConfirmacion);
};

// Función para eliminar productos del carrito
function quitarProducto(producto) {
    const index = productosEnCarrito.findIndex(prod => prod.nombre === producto.nombre);
    if (index > -1) {
        productosEnCarrito.splice(index, 1);
    };

    cantidadTotal -= producto.cantidad;
    total = productosEnCarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);

    actualizarNumerito();
    mostrarTotalCarrito();
    abrirCarrito();  // Refrescar el carrito
};

// Agregamos un evento a cada botón de categorías
botonesCategorias.forEach(boton => {
    boton.addEventListener('click', (e) => {
        botonesCategorias.forEach(boton => {
            boton.classList.remove('active');
        });
        e.currentTarget.classList.add('active');

        if (e.currentTarget.id !== 'todos') {
            const productosBoton = productos.filter(producto => producto.categoria === e.currentTarget.id);
            tituloPrincipal.innerText = e.currentTarget.textContent;
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.textContent = 'Todos los productos';
            cargarProductos(productos);
        };

        abrirModalOferta();
    });
});

// Función para abrir modal oferta
function abrirModalOferta() {
    const productoOferta = seleccionarProductoAlAzar();
    const precioConDescuento = aplicarDescuento(productoOferta, 15);

    const modalOferta = document.createElement('div');
    modalOferta.className = 'modal-oferta';

    const modalOfertaContent = document.createElement('div');
    modalOfertaContent.className = 'modal-oferta-content'; 

    const modalOfertaHeader = document.createElement('div');
    modalOfertaHeader.className = 'modal-oferta-header';

    const tituloModal = document.createElement('h2');
    tituloModal.innerText = '¡Oferta del día!';

    const botonCerrar = document.createElement('button');
    botonCerrar.className = 'cerrarModal bi bi-x-lg'; 
    botonCerrar.addEventListener('click', () => {
        document.body.removeChild(modalOferta);
    });

    // Elementos del producto

    const ofertaContenido = document.createElement('div');
    ofertaContenido.className = 'oferta-contenido';

    const imagenProducto = document.createElement('img');
    imagenProducto.src = productoOferta.img[0];
    imagenProducto.alt = productoOferta.nombre;

    const ofertaContenidoTexto = document.createElement('div');
    ofertaContenidoTexto.className = 'oferta-contenido-texto';    

    const nombreProductoElemento = document.createElement('h2');
    nombreProductoElemento.classList.add('producto-titulo');
    nombreProductoElemento.innerText = productoOferta.nombre;

    const descripcionProducto = document.createElement('p');    
    descripcionProducto.classList.add('descripcion-producto');  
    descripcionProducto.innerText = productoOferta.descripcion;

    const precioProducto = document.createElement('p');
    precioProducto.innerText = `$${productoOferta.precio}`;
    precioProducto.classList.add('producto-precio-tachar');

    const precioConDescuentoElemento = document.createElement('p');
    precioConDescuentoElemento.classList.add('producto-precio-descuento');
    precioConDescuentoElemento.innerText = `$${precioConDescuento}`;

    const botonAgregar = document.createElement('button');
    botonAgregar.classList.add('producto-agregar');
    botonAgregar.setAttribute('data-id', productoOferta.nombre);
    botonAgregar.textContent = 'Agregar';
    botonAgregar.addEventListener('click', agregarCarritoOferta);

    const bag = document.createElement('i');
    bag.classList.add('bi', 'bi-bag-plus');

    // Armamos la modal
    botonAgregar.prepend(bag);
    
    ofertaContenidoTexto.append(nombreProductoElemento, descripcionProducto, precioProducto, precioConDescuentoElemento, botonAgregar)
    
    ofertaContenido.append(imagenProducto, ofertaContenidoTexto );
    modalOfertaHeader.append(tituloModal, botonCerrar);

    modalOfertaContent.append(modalOfertaHeader,  ofertaContenido);

    modalOferta.append(modalOfertaContent);

    document.body.appendChild(modalOferta);
    
    setTimeout(() => {
        if (document.body.contains(modalOferta)) {
            document.body.removeChild(modalOferta);
        }
    }, 10000); // Ocultar después de 10 segundos
};

// Función para seleccionar un producto al azar
function seleccionarProductoAlAzar() {
    const indiceAleatorio = Math.floor(Math.random() * productos.length);
    return productos[indiceAleatorio];
};

// Función para aplicar descuento
function aplicarDescuento(producto, porcentajeDescuento) {
    const precioConDescuento = producto.precio - (producto.precio * (porcentajeDescuento / 100));
    return precioConDescuento.toFixed(0); // Redondear 
};