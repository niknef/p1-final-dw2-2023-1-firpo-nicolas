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
